import { injectable, inject } from 'tsyringe';
import { CustomerId, PaymentStatus } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';
import {
  PaymentDomainService,
  Payment,
  CreditEntry,
  CreditHistory,
  PaymentEvent,
  PaymentNotFoundException,
} from '@food-ordering-system/payment-domain-core';
import { PaymentRequest } from './dto/PaymentRequest';
import { PaymentDataMapper } from './mapper/PaymentDataMapper';
import { PaymentRepository } from './ports/output/repository/PaymentRepository';
import { CreditEntryRepository } from './ports/output/repository/CreditEntryRepository';
import { CreditHistoryRepository } from './ports/output/repository/CreditHistoryRepository';
import { OrderOutboxHelper } from './outbox/OrderOutboxHelper';
import { PaymentResponseMessagePublisher } from './ports/output/message/PaymentResponseMessagePublisher';
import { PaymentApplicationServiceException } from './exception/PaymentApplicationServiceException';

@injectable()
export class PaymentRequestHelper {
  constructor(
    @inject('PaymentDomainService')
    private readonly paymentDomainService: PaymentDomainService,
    private readonly paymentDataMapper: PaymentDataMapper,
    @inject('PaymentRepository')
    private readonly paymentRepository: PaymentRepository,
    @inject('CreditEntryRepository')
    private readonly creditEntryRepository: CreditEntryRepository,
    @inject('CreditHistoryRepository')
    private readonly creditHistoryRepository: CreditHistoryRepository,
    private readonly orderOutboxHelper: OrderOutboxHelper,
    @inject('PaymentResponseMessagePublisher')
    private readonly paymentResponseMessagePublisher: PaymentResponseMessagePublisher
  ) {}

  async persistPayment(paymentRequest: PaymentRequest): Promise<void> {
    if (await this.publishIfOutboxMessageProcessedForPayment(paymentRequest, PaymentStatus.COMPLETED)) {
      console.log(`An outbox message with saga id: ${paymentRequest.sagaId} is already saved to database!`);
      return;
    }

    console.log(`Received payment complete event for order id: ${paymentRequest.orderId}`);
    const payment = this.paymentDataMapper.paymentRequestModelToPayment(paymentRequest);
    const creditEntry = await this.getCreditEntry(payment.customerId);
    const creditHistories = await this.getCreditHistory(payment.customerId);
    const failureMessages: string[] = [];
    const paymentEvent = this.paymentDomainService.validateAndInitiatePayment(
      payment,
      creditEntry,
      creditHistories,
      failureMessages
    );
    await this.persistDbObjects(payment, creditEntry, creditHistories, failureMessages);

    await this.orderOutboxHelper.saveOrderOutboxMessage(
      this.paymentDataMapper.paymentEventToOrderEventPayload(paymentEvent),
      paymentEvent.payment.paymentStatus!,
      OutboxStatus.STARTED,
      paymentRequest.sagaId
    );
  }

  async persistCancelPayment(paymentRequest: PaymentRequest): Promise<void> {
    if (await this.publishIfOutboxMessageProcessedForPayment(paymentRequest, PaymentStatus.CANCELLED)) {
      console.log(`An outbox message with saga id: ${paymentRequest.sagaId} is already saved to database!`);
      return;
    }

    console.log(`Received payment rollback event for order id: ${paymentRequest.orderId}`);
    const paymentResponse = await this.paymentRepository.findByOrderId(paymentRequest.orderId);
    if (!paymentResponse) {
      console.error(`Payment with order id: ${paymentRequest.orderId} could not be found!`);
      throw new PaymentNotFoundException(`Payment with order id: ${paymentRequest.orderId} could not be found!`);
    }
    const payment = paymentResponse;
    const creditEntry = await this.getCreditEntry(payment.customerId);
    const creditHistories = await this.getCreditHistory(payment.customerId);
    const failureMessages: string[] = [];
    const paymentEvent = this.paymentDomainService.validateAndCancelPayment(
      payment,
      creditEntry,
      creditHistories,
      failureMessages
    );
    await this.persistDbObjects(payment, creditEntry, creditHistories, failureMessages);

    await this.orderOutboxHelper.saveOrderOutboxMessage(
      this.paymentDataMapper.paymentEventToOrderEventPayload(paymentEvent),
      paymentEvent.payment.paymentStatus!,
      OutboxStatus.STARTED,
      paymentRequest.sagaId
    );
  }

  private async getCreditEntry(customerId: CustomerId): Promise<CreditEntry> {
    const creditEntry = await this.creditEntryRepository.findByCustomerId(customerId);
    if (!creditEntry) {
      console.error(`Could not find credit entry for customer: ${customerId.getValue()}`);
      throw new PaymentApplicationServiceException(
        `Could not find credit entry for customer: ${customerId.getValue()}`
      );
    }
    return creditEntry;
  }

  private async getCreditHistory(customerId: CustomerId): Promise<CreditHistory[]> {
    const creditHistories = await this.creditHistoryRepository.findByCustomerId(customerId);
    if (!creditHistories || creditHistories.length === 0) {
      console.error(`Could not find credit history for customer: ${customerId.getValue()}`);
      throw new PaymentApplicationServiceException(
        `Could not find credit history for customer: ${customerId.getValue()}`
      );
    }
    return creditHistories;
  }

  private async persistDbObjects(
    payment: Payment,
    creditEntry: CreditEntry,
    creditHistories: CreditHistory[],
    failureMessages: string[]
  ): Promise<void> {
    await this.paymentRepository.save(payment);
    if (failureMessages.length === 0) {
      await this.creditEntryRepository.save(creditEntry);
      await this.creditHistoryRepository.save(creditHistories[creditHistories.length - 1]);
    }
  }

  private async publishIfOutboxMessageProcessedForPayment(
    paymentRequest: PaymentRequest,
    paymentStatus: PaymentStatus
  ): Promise<boolean> {
    const orderOutboxMessage = await this.orderOutboxHelper.getCompletedOrderOutboxMessageBySagaIdAndPaymentStatus(
      paymentRequest.sagaId,
      paymentStatus
    );
    if (orderOutboxMessage) {
      await this.paymentResponseMessagePublisher.publish(orderOutboxMessage, (outboxMessage) =>
        this.orderOutboxHelper.updateOutboxMessage(outboxMessage)
      );
      return true;
    }
    return false;
  }
}
