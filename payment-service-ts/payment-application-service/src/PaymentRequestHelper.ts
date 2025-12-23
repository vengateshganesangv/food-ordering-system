import { CustomerId, PaymentStatus } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { Logger } from '@food-ordering-system/kafka-producer';
import {
  PaymentDomainService,
  Payment,
  CreditEntry,
  CreditHistory,
  PaymentEvent,
  PaymentNotFoundException
} from '@food-ordering-system/payment-domain-core';
import { PaymentRequest } from './dto/PaymentRequest';
import { PaymentApplicationServiceException } from './exception/PaymentApplicationServiceException';
import { PaymentDataMapper } from './mapper/PaymentDataMapper';
import { OrderOutboxHelper } from './outbox/scheduler/OrderOutboxHelper';
import { PaymentResponseMessagePublisher } from './ports/output/message/publisher/PaymentResponseMessagePublisher';
import { CreditEntryRepository } from './ports/output/repository/CreditEntryRepository';
import { CreditHistoryRepository } from './ports/output/repository/CreditHistoryRepository';
import { PaymentRepository } from './ports/output/repository/PaymentRepository';

const logger = new Logger('PaymentRequestHelper');

export class PaymentRequestHelper {
  constructor(
    private readonly paymentDomainService: PaymentDomainService,
    private readonly paymentDataMapper: PaymentDataMapper,
    private readonly paymentRepository: PaymentRepository,
    private readonly creditEntryRepository: CreditEntryRepository,
    private readonly creditHistoryRepository: CreditHistoryRepository,
    private readonly orderOutboxHelper: OrderOutboxHelper,
    private readonly paymentResponseMessagePublisher: PaymentResponseMessagePublisher
  ) {}

  public async persistPayment(paymentRequest: PaymentRequest): Promise<void> {
    if (await this.publishIfOutboxMessageProcessedForPayment(paymentRequest, PaymentStatus.COMPLETED)) {
      logger.info(`An outbox message with saga id: ${paymentRequest.sagaId} is already saved to database!`);
      return;
    }

    logger.info(`Received payment complete event for order id: ${paymentRequest.orderId}`);
    const payment = this.paymentDataMapper.paymentRequestModelToPayment(paymentRequest);
    const creditEntry = await this.getCreditEntry(payment.getCustomerId());
    const creditHistories = await this.getCreditHistory(payment.getCustomerId());
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
      paymentEvent.getPayment().getPaymentStatus()!,
      OutboxStatus.STARTED,
      paymentRequest.sagaId
    );
  }

  public async persistCancelPayment(paymentRequest: PaymentRequest): Promise<void> {
    if (await this.publishIfOutboxMessageProcessedForPayment(paymentRequest, PaymentStatus.CANCELLED)) {
      logger.info(`An outbox message with saga id: ${paymentRequest.sagaId} is already saved to database!`);
      return;
    }

    logger.info(`Received payment rollback event for order id: ${paymentRequest.orderId}`);
    const payment = await this.paymentRepository.findByOrderId(paymentRequest.orderId);
    if (!payment) {
      logger.error(`Payment with order id: ${paymentRequest.orderId} could not be found!`);
      throw new PaymentNotFoundException(`Payment with order id: ${paymentRequest.orderId} could not be found!`);
    }

    const creditEntry = await this.getCreditEntry(payment.getCustomerId());
    const creditHistories = await this.getCreditHistory(payment.getCustomerId());
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
      paymentEvent.getPayment().getPaymentStatus()!,
      OutboxStatus.STARTED,
      paymentRequest.sagaId
    );
  }

  private async getCreditEntry(customerId: CustomerId): Promise<CreditEntry> {
    const creditEntry = await this.creditEntryRepository.findByCustomerId(customerId);
    if (!creditEntry) {
      logger.error(`Could not find credit entry for customer: ${customerId.getValue()}`);
      throw new PaymentApplicationServiceException(
        `Could not find credit entry for customer: ${customerId.getValue()}`
      );
    }
    return creditEntry;
  }

  private async getCreditHistory(customerId: CustomerId): Promise<CreditHistory[]> {
    const creditHistories = await this.creditHistoryRepository.findByCustomerId(customerId);
    if (!creditHistories || creditHistories.length === 0) {
      logger.error(`Could not find credit history for customer: ${customerId.getValue()}`);
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
      this.paymentResponseMessagePublisher.publish(
        orderOutboxMessage,
        this.orderOutboxHelper.updateOutboxMessage.bind(this.orderOutboxHelper)
      );
      return true;
    }
    return false;
  }
}
