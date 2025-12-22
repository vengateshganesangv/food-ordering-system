import { PaymentStatus, OutboxStatus, logger, ORDER_SAGA_NAME } from '@food-ordering-system/common-domain';
import { PaymentDomainException } from '@food-ordering-system/payment-domain-core';
import { OrderEventPayload } from '../model/OrderEventPayload';
import { OrderOutboxMessage } from '../model/OrderOutboxMessage';
import { OrderOutboxRepository } from '../../ports/output/repository/OrderOutboxRepository';
import { v4 as uuidv4 } from 'uuid';

export class OrderOutboxHelper {
  constructor(private readonly orderOutboxRepository: OrderOutboxRepository) {}

  public async getCompletedOrderOutboxMessageBySagaIdAndPaymentStatus(
    sagaId: string,
    paymentStatus: PaymentStatus
  ): Promise<OrderOutboxMessage | null> {
    return this.orderOutboxRepository.findByTypeAndSagaIdAndPaymentStatusAndOutboxStatus(
      ORDER_SAGA_NAME,
      sagaId,
      paymentStatus,
      OutboxStatus.COMPLETED
    );
  }

  public async getOrderOutboxMessageByOutboxStatus(outboxStatus: OutboxStatus): Promise<OrderOutboxMessage[]> {
    return this.orderOutboxRepository.findByTypeAndOutboxStatus(ORDER_SAGA_NAME, outboxStatus);
  }

  public async deleteOrderOutboxMessageByOutboxStatus(outboxStatus: OutboxStatus): Promise<void> {
    await this.orderOutboxRepository.deleteByTypeAndOutboxStatus(ORDER_SAGA_NAME, outboxStatus);
  }

  public async saveOrderOutboxMessage(
    orderEventPayload: OrderEventPayload,
    paymentStatus: PaymentStatus,
    outboxStatus: OutboxStatus,
    sagaId: string
  ): Promise<void> {
    await this.save(
      OrderOutboxMessage.builder()
        .setId(uuidv4())
        .setSagaId(sagaId)
        .setCreatedAt(orderEventPayload.createdAt)
        .setProcessedAt(new Date())
        .setType(ORDER_SAGA_NAME)
        .setPayload(this.createPayload(orderEventPayload))
        .setPaymentStatus(paymentStatus)
        .setOutboxStatus(outboxStatus)
        .build()
    );
  }

  public async updateOutboxMessage(
    orderOutboxMessage: OrderOutboxMessage,
    outboxStatus: OutboxStatus
  ): Promise<void> {
    orderOutboxMessage.setOutboxStatus(outboxStatus);
    await this.save(orderOutboxMessage);
    logger.info(`Order outbox table status is updated as: ${outboxStatus}`);
  }

  private createPayload(orderEventPayload: OrderEventPayload): string {
    try {
      return JSON.stringify(orderEventPayload);
    } catch (error) {
      logger.error('Could not create OrderEventPayload json!', error);
      throw new PaymentDomainException('Could not create OrderEventPayload json!', error as Error);
    }
  }

  private async save(orderOutboxMessage: OrderOutboxMessage): Promise<void> {
    const response = await this.orderOutboxRepository.save(orderOutboxMessage);
    if (!response) {
      logger.error('Could not save OrderOutboxMessage!');
      throw new PaymentDomainException('Could not save OrderOutboxMessage!');
    }
    logger.info(`OrderOutboxMessage is saved with id: ${orderOutboxMessage.id}`);
  }
}
