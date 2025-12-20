import { injectable, inject } from 'tsyringe';
import { OrderApprovalStatus } from '@food-ordering-system/common-domain';
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
    approvalStatus: OrderApprovalStatus,
    outboxStatus: OutboxStatus,
    sagaId: string
  ): Promise<void> {
    const orderOutboxMessage = new OrderOutboxMessage({
      id: uuidv4(),
      sagaId,
      createdAt: new Date(),
      type: OrderOutboxHelper.ORDER_SAGA_NAME,
      payload: JSON.stringify(orderEventPayload),
      approvalStatus,
      outboxStatus,
      version: 0,
    });

    await this.orderOutboxRepository.save(orderOutboxMessage);
    console.log(`OrderOutboxMessage saved with id: ${orderOutboxMessage.id}`);
  }

  async getCompletedOrderOutboxMessageBySagaIdAndApprovalStatus(
    sagaId: string,
    approvalStatus: OrderApprovalStatus
  ): Promise<OrderOutboxMessage | null> {
    return await this.orderOutboxRepository.findByTypeAndSagaIdAndApprovalStatusAndOutboxStatus(
      OrderOutboxHelper.ORDER_SAGA_NAME,
      sagaId,
      approvalStatus,
      OutboxStatus.COMPLETED
    );
  }

  async updateOutboxMessage(orderOutboxMessage: OrderOutboxMessage): Promise<void> {
    orderOutboxMessage.outboxStatus = OutboxStatus.COMPLETED;
    await this.orderOutboxRepository.save(orderOutboxMessage);
    console.log(`OrderOutboxMessage updated with id: ${orderOutboxMessage.id}`);
  }
}
