import { injectable, inject } from 'tsyringe';
import { PaymentStatus } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { OrderOutboxMessage } from './OrderOutboxMessage';
import { OrderEventPayload } from './OrderEventPayload';
import { OrderOutboxRepository } from '../ports/output/repository/OrderOutboxRepository';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class OrderOutboxHelper {
  private static readonly ORDER_SAGA_NAME = 'OrderProcessingSaga';

  constructor(
    @inject('OrderOutboxRepository')
    private readonly orderOutboxRepository: OrderOutboxRepository
  ) {}

  async saveOrderOutboxMessage(
    orderEventPayload: OrderEventPayload,
    paymentStatus: PaymentStatus,
    outboxStatus: OutboxStatus,
    sagaId: string
  ): Promise<void> {
    const orderOutboxMessage = new OrderOutboxMessage({
      id: uuidv4(),
      sagaId,
      createdAt: new Date(),
      type: OrderOutboxHelper.ORDER_SAGA_NAME,
      payload: JSON.stringify(orderEventPayload),
      paymentStatus,
      outboxStatus,
      version: 0,
    });

    await this.orderOutboxRepository.save(orderOutboxMessage);
    console.log(`OrderOutboxMessage saved with id: ${orderOutboxMessage.id}`);
  }

  async getCompletedOrderOutboxMessageBySagaIdAndPaymentStatus(
    sagaId: string,
    paymentStatus: PaymentStatus
  ): Promise<OrderOutboxMessage | null> {
    return await this.orderOutboxRepository.findByTypeAndSagaIdAndPaymentStatusAndOutboxStatus(
      OrderOutboxHelper.ORDER_SAGA_NAME,
      sagaId,
      paymentStatus,
      OutboxStatus.COMPLETED
    );
  }

  async updateOutboxMessage(orderOutboxMessage: OrderOutboxMessage): Promise<void> {
    orderOutboxMessage.outboxStatus = OutboxStatus.COMPLETED;
    await this.orderOutboxRepository.save(orderOutboxMessage);
    console.log(`OrderOutboxMessage updated with id: ${orderOutboxMessage.id}`);
  }
}
