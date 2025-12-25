import { Money, PaymentStatus } from '@food-ordering-system/common-domain';
import { Logger } from '@food-ordering-system/kafka-producer';

const logger = new Logger('PaymentDomainService');
import { Payment } from './entity/Payment';
import { CreditEntry } from './entity/CreditEntry';
import { CreditHistory } from './entity/CreditHistory';
import { PaymentEvent } from './event/PaymentEvent';
import { PaymentCompletedEvent } from './event/PaymentCompletedEvent';
import { PaymentCancelledEvent } from './event/PaymentCancelledEvent';
import { PaymentFailedEvent } from './event/PaymentFailedEvent';
import { TransactionType } from './valueobject/TransactionType';
import { CreditHistoryId } from './valueobject/CreditHistoryId';
import { PaymentDomainService } from './PaymentDomainService';
import { v4 as uuidv4 } from 'uuid';

export class PaymentDomainServiceImpl implements PaymentDomainService {
  public validateAndInitiatePayment(
    payment: Payment,
    creditEntry: CreditEntry,
    creditHistories: CreditHistory[],
    failureMessages: string[]
  ): PaymentEvent {
    payment.validatePayment(failureMessages);
    payment.initializePayment();
    this.validateCreditEntry(payment, creditEntry, failureMessages);
    this.subtractCreditEntry(payment, creditEntry);
    this.updateCreditHistory(payment, creditHistories, TransactionType.DEBIT);
    this.validateCreditHistory(creditEntry, creditHistories, failureMessages);

    if (failureMessages.length === 0) {
      logger.info(`Payment is initiated for order id: ${payment.getOrderId().getValue()}`);
      payment.updateStatus(PaymentStatus.COMPLETED);
      return new PaymentCompletedEvent(payment, new Date());
    } else {
      logger.info(`Payment initiation is failed for order id: ${payment.getOrderId().getValue()}`);
      payment.updateStatus(PaymentStatus.FAILED);
      return new PaymentFailedEvent(payment, new Date(), failureMessages);
    }
  }

  public validateAndCancelPayment(
    payment: Payment,
    creditEntry: CreditEntry,
    creditHistories: CreditHistory[],
    failureMessages: string[]
  ): PaymentEvent {
    payment.validatePayment(failureMessages);
    this.addCreditEntry(payment, creditEntry);
    this.updateCreditHistory(payment, creditHistories, TransactionType.CREDIT);

    if (failureMessages.length === 0) {
      logger.info(`Payment is cancelled for order id: ${payment.getOrderId().getValue()}`);
      payment.updateStatus(PaymentStatus.CANCELLED);
      return new PaymentCancelledEvent(payment, new Date());
    } else {
      logger.info(`Payment cancellation is failed for order id: ${payment.getOrderId().getValue()}`);
      payment.updateStatus(PaymentStatus.FAILED);
      return new PaymentFailedEvent(payment, new Date(), failureMessages);
    }
  }

  private validateCreditEntry(payment: Payment, creditEntry: CreditEntry, failureMessages: string[]): void {
    if (payment.getPrice().isGreaterThan(creditEntry.getTotalCreditAmount())) {
      logger.error(`Customer with id: ${payment.getCustomerId().getValue()} doesn't have enough credit for payment!`);
      failureMessages.push(
        `Customer with id=${payment.getCustomerId().getValue()} doesn't have enough credit for payment!`
      );
    }
  }

  private subtractCreditEntry(payment: Payment, creditEntry: CreditEntry): void {
    creditEntry.subtractCreditAmount(payment.getPrice());
  }

  private updateCreditHistory(
    payment: Payment,
    creditHistories: CreditHistory[],
    transactionType: TransactionType
  ): void {
    creditHistories.push(
      CreditHistory.builder()
        .setCreditHistoryId(new CreditHistoryId(uuidv4()))
        .setCustomerId(payment.getCustomerId())
        .setAmount(payment.getPrice())
        .setTransactionType(transactionType)
        .build()
    );
  }

  private validateCreditHistory(
    creditEntry: CreditEntry,
    creditHistories: CreditHistory[],
    failureMessages: string[]
  ): void {
    const totalCreditHistory = this.getTotalHistoryAmount(creditHistories, TransactionType.CREDIT);
    const totalDebitHistory = this.getTotalHistoryAmount(creditHistories, TransactionType.DEBIT);

    if (totalDebitHistory.isGreaterThan(totalCreditHistory)) {
      logger.error(
        `Customer with id: ${creditEntry.getCustomerId().getValue()} doesn't have enough credit according to credit history`
      );
      failureMessages.push(
        `Customer with id=${creditEntry.getCustomerId().getValue()} doesn't have enough credit according to credit history!`
      );
    }

    if (!creditEntry.getTotalCreditAmount().equals(totalCreditHistory.subtract(totalDebitHistory))) {
      logger.error(
        `Credit history total is not equal to current credit for customer id: ${creditEntry.getCustomerId().getValue()}!`
      );
      failureMessages.push(
        `Credit history total is not equal to current credit for customer id: ${creditEntry.getCustomerId().getValue()}!`
      );
    }
  }

  private getTotalHistoryAmount(creditHistories: CreditHistory[], transactionType: TransactionType): Money {
    return creditHistories
      .filter(creditHistory => transactionType === creditHistory.getTransactionType())
      .map(creditHistory => creditHistory.getAmount())
      .reduce((acc, amount) => acc.add(amount), Money.ZERO);
  }

  private addCreditEntry(payment: Payment, creditEntry: CreditEntry): void {
    creditEntry.addCreditAmount(payment.getPrice());
  }
}
