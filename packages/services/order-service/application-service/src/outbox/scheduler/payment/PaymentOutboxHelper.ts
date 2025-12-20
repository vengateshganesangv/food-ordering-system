import { injectable, inject } from 'tsyringe';
import { OrderStatus } from '@food-ordering-system/common-domain';
import { OrderDomainException } from '@food-ordering-system/order-domain-core';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { SagaStatus, ORDER_SAGA_NAME } from '@food-ordering-system/saga';
import { OrderPaymentEventPayload } from '../../model/payment/OrderPaymentEventPayload';
import { OrderPaymentOutboxMessage } from '../../model/payment/OrderPaymentOutboxMessage';
import { PaymentOutboxRepository } from '../../../ports/output/repository/PaymentOutboxRepository';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class PaymentOutboxHelper {
  constructor(
    @inject('PaymentOutboxRepository') private paymentOutboxRepository: PaymentOutboxRepository
  ) {}

  async getPaymentOutboxMessageByOutboxStatusAndSagaStatus(
    outboxStatus: OutboxStatus,
    ...sagaStatus: SagaStatus[]
  ): Promise<OrderPaymentOutboxMessage[]> {
    return this.paymentOutboxRepository.findByTypeAndOutboxStatusAndSagaStatus(
      ORDER_SAGA_NAME,
      outboxStatus,
      ...sagaStatus
    );
  }

  async getPaymentOutboxMessageBySagaIdAndSagaStatus(
    sagaId: string,
    ...sagaStatus: SagaStatus[]
  ): Promise<OrderPaymentOutboxMessage | null> {
    return this.paymentOutboxRepository.findByTypeAndSagaIdAndSagaStatus(
      ORDER_SAGA_NAME,
      sagaId,
      ...sagaStatus
    );
  }

  async save(orderPaymentOutboxMessage: OrderPaymentOutboxMessage): Promise<void> {
    const response = await this.paymentOutboxRepository.save(orderPaymentOutboxMessage);
    if (!response) {
      console.error('Could not save OrderPaymentOutboxMessage with outbox id:', orderPaymentOutboxMessage.id);
      throw new OrderDomainException('Could not save OrderPaymentOutboxMessage with outbox id: ' + orderPaymentOutboxMessage.id);
    }
    console.log('OrderPaymentOutboxMessage saved with outbox id:', orderPaymentOutboxMessage.id);
  }

  async savePaymentOutboxMessage(
    paymentEventPayload: OrderPaymentEventPayload,
    orderStatus: OrderStatus,
    sagaStatus: SagaStatus,
    outboxStatus: OutboxStatus,
    sagaId: string
  ): Promise<void> {
    await this.save(
      new OrderPaymentOutboxMessage(
        uuidv4(),
        sagaId,
        paymentEventPayload.createdAt,
        undefined,
        ORDER_SAGA_NAME,
        this.createPayload(paymentEventPayload),
        sagaStatus,
        orderStatus,
        outboxStatus,
        0
      )
    );
  }

  async deletePaymentOutboxMessageByOutboxStatusAndSagaStatus(
    outboxStatus: OutboxStatus,
    ...sagaStatus: SagaStatus[]
  ): Promise<void> {
    await this.paymentOutboxRepository.deleteByTypeAndOutboxStatusAndSagaStatus(
      ORDER_SAGA_NAME,
      outboxStatus,
      ...sagaStatus
    );
  }

  private createPayload(paymentEventPayload: OrderPaymentEventPayload): string {
    try {
      return JSON.stringify(paymentEventPayload);
    } catch (e) {
      console.error('Could not create OrderPaymentEventPayload object for order id:', paymentEventPayload.orderId, e);
      throw new OrderDomainException('Could not create OrderPaymentEventPayload object for order id: ' + paymentEventPayload.orderId);
    }
  }
}
