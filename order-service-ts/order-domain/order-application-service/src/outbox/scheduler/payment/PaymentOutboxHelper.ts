import { v4 as uuidv4 } from 'uuid';
import { OrderStatus, OutboxStatus, SagaStatus, ORDER_SAGA_NAME } from '@food-ordering-system/common-domain';
import { OrderDomainException } from '@food-ordering-system/order-domain-core';
import { OrderPaymentEventPayload } from '../../model/payment/OrderPaymentEventPayload';
import { OrderPaymentOutboxMessage } from '../../model/payment/OrderPaymentOutboxMessage';
import { PaymentOutboxRepository } from '../../../ports/output/repository/PaymentOutboxRepository';

/**
 * Payment Outbox Helper
 * Helper class for managing payment outbox messages
 */
export class PaymentOutboxHelper {
  private static readonly logger = {
    info: (message: string, ...args: any[]) => console.log(`[PaymentOutboxHelper] ${message}`, ...args),
    error: (message: string, ...args: any[]) => console.error(`[PaymentOutboxHelper] ${message}`, ...args),
  };

  constructor(private readonly paymentOutboxRepository: PaymentOutboxRepository) {}

  async getPaymentOutboxMessageByOutboxStatusAndSagaStatus(
    outboxStatus: OutboxStatus,
    ...sagaStatus: SagaStatus[]
  ): Promise<OrderPaymentOutboxMessage[] | undefined> {
    return this.paymentOutboxRepository.findByTypeAndOutboxStatusAndSagaStatus(
      ORDER_SAGA_NAME,
      outboxStatus,
      sagaStatus,
    );
  }

  async getPaymentOutboxMessageBySagaIdAndSagaStatus(
    sagaId: string,
    ...sagaStatus: SagaStatus[]
  ): Promise<OrderPaymentOutboxMessage | undefined> {
    return this.paymentOutboxRepository.findByTypeAndSagaIdAndSagaStatus(ORDER_SAGA_NAME, sagaId, sagaStatus);
  }

  async save(orderPaymentOutboxMessage: OrderPaymentOutboxMessage): Promise<void> {
    const response = await this.paymentOutboxRepository.save(orderPaymentOutboxMessage);
    if (!response) {
      PaymentOutboxHelper.logger.error(
        `Could not save OrderPaymentOutboxMessage with outbox id: ${orderPaymentOutboxMessage.getId()}`,
      );
      throw new OrderDomainException(
        `Could not save OrderPaymentOutboxMessage with outbox id: ${orderPaymentOutboxMessage.getId()}`,
      );
    }
    PaymentOutboxHelper.logger.info(
      `OrderPaymentOutboxMessage saved with outbox id: ${orderPaymentOutboxMessage.getId()}`,
    );
  }

  async savePaymentOutboxMessage(
    paymentEventPayload: OrderPaymentEventPayload,
    orderStatus: OrderStatus,
    sagaStatus: SagaStatus,
    outboxStatus: OutboxStatus,
    sagaId: string,
  ): Promise<void> {
    await this.save(
      OrderPaymentOutboxMessage.builder()
        .id(uuidv4())
        .sagaId(sagaId)
        .createdAt(paymentEventPayload.createdAt)
        .type(ORDER_SAGA_NAME)
        .payload(this.createPayload(paymentEventPayload))
        .orderStatus(orderStatus)
        .sagaStatus(sagaStatus)
        .outboxStatus(outboxStatus)
        .version(0)
        .build(),
    );
  }

  async deletePaymentOutboxMessageByOutboxStatusAndSagaStatus(
    outboxStatus: OutboxStatus,
    ...sagaStatus: SagaStatus[]
  ): Promise<void> {
    await this.paymentOutboxRepository.deleteByTypeAndOutboxStatusAndSagaStatus(
      ORDER_SAGA_NAME,
      outboxStatus,
      sagaStatus,
    );
  }

  private createPayload(paymentEventPayload: OrderPaymentEventPayload): string {
    try {
      return JSON.stringify(paymentEventPayload);
    } catch (error) {
      PaymentOutboxHelper.logger.error(
        `Could not create OrderPaymentEventPayload object for order id: ${paymentEventPayload.orderId}`,
        error,
      );
      throw new OrderDomainException(
        `Could not create OrderPaymentEventPayload object for order id: ${paymentEventPayload.orderId}`,
      );
    }
  }
}
