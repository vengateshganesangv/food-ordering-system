import { PaymentStatus } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { ORDER_SAGA_NAME } from '@food-ordering-system/saga';
import { PaymentDomainException } from '@food-ordering-system/payment-domain-core';
import { OrderEventPayload } from '../model/OrderEventPayload';
import { OrderOutboxMessage } from '../model/OrderOutboxMessage';
import { OrderOutboxRepository } from '../../ports/output/repository/OrderOutboxRepository';
import { v4 as uuidv4 } from 'uuid';

export class OrderOutboxHelper {
  constructor(
    private readonly orderOutboxRepository: OrderOutboxRepository
  ) {}

  async getCompletedOrderOutboxMessageBySagaIdAndPaymentStatus(
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

  async getOrderOutboxMessageByOutboxStatus(
    outboxStatus: OutboxStatus
  ): Promise<OrderOutboxMessage[] | null> {
    return this.orderOutboxRepository.findByTypeAndOutboxStatus(ORDER_SAGA_NAME, outboxStatus);
  }

  async deleteOrderOutboxMessageByOutboxStatus(outboxStatus: OutboxStatus): Promise<void> {
    await this.orderOutboxRepository.deleteByTypeAndOutboxStatus(ORDER_SAGA_NAME, outboxStatus);
  }

  async saveOrderOutboxMessage(
    orderEventPayload: OrderEventPayload,
    paymentStatus: PaymentStatus,
    outboxStatus: OutboxStatus,
    sagaId: string
  ): Promise<void> {
    await this.save(
      OrderOutboxMessage.builder()
        .id(uuidv4())
        .sagaId(sagaId)
        .createdAt(orderEventPayload.createdAt)
        .processedAt(new Date())
        .type(ORDER_SAGA_NAME)
        .payload(this.createPayload(orderEventPayload))
        .paymentStatus(paymentStatus)
        .outboxStatus(outboxStatus)
        .build()
    );
  }

  async updateOutboxMessage(
    orderOutboxMessage: OrderOutboxMessage,
    outboxStatus: OutboxStatus
  ): Promise<void> {
    orderOutboxMessage.setOutboxStatus(outboxStatus);
    await this.save(orderOutboxMessage);
    console.log(`Order outbox table status is updated as: ${outboxStatus}`);
  }

  private createPayload(orderEventPayload: OrderEventPayload): string {
    try {
      return JSON.stringify(orderEventPayload);
    } catch (e) {
      const error = e as Error;
      console.error('Could not create OrderEventPayload json!', error);
      throw new PaymentDomainException('Could not create OrderEventPayload json!', error);
    }
  }

  private async save(orderOutboxMessage: OrderOutboxMessage): Promise<void> {
    const response = await this.orderOutboxRepository.save(orderOutboxMessage);
    if (!response) {
      console.error('Could not save OrderOutboxMessage!');
      throw new PaymentDomainException('Could not save OrderOutboxMessage!');
    }
    console.log(`OrderOutboxMessage is saved with id: ${orderOutboxMessage.id}`);
  }
}
