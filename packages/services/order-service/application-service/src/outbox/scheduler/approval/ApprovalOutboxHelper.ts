import { injectable, inject } from 'tsyringe';
import { OrderStatus } from '@food-ordering-system/common-domain';
import { OrderDomainException } from '@food-ordering-system/order-domain-core';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { SagaStatus, ORDER_SAGA_NAME } from '@food-ordering-system/saga';
import { OrderApprovalEventPayload } from '../../model/approval/OrderApprovalEventPayload';
import { OrderApprovalOutboxMessage } from '../../model/approval/OrderApprovalOutboxMessage';
import { ApprovalOutboxRepository } from '../../../ports/output/repository/ApprovalOutboxRepository';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class ApprovalOutboxHelper {
  constructor(
    @inject('ApprovalOutboxRepository') private approvalOutboxRepository: ApprovalOutboxRepository
  ) {}

  async getApprovalOutboxMessageBySagaIdAndSagaStatus(
    sagaId: string,
    ...sagaStatus: SagaStatus[]
  ): Promise<OrderApprovalOutboxMessage | null> {
    return this.approvalOutboxRepository.findByTypeAndSagaIdAndSagaStatus(
      ORDER_SAGA_NAME,
      sagaId,
      ...sagaStatus
    );
  }

  async save(orderApprovalOutboxMessage: OrderApprovalOutboxMessage): Promise<void> {
    const response = await this.approvalOutboxRepository.save(orderApprovalOutboxMessage);
    if (!response) {
      console.error('Could not save OrderApprovalOutboxMessage with outbox id:', orderApprovalOutboxMessage.id);
      throw new OrderDomainException('Could not save OrderApprovalOutboxMessage with outbox id: ' + orderApprovalOutboxMessage.id);
    }
    console.log('OrderApprovalOutboxMessage saved with outbox id:', orderApprovalOutboxMessage.id);
  }

  async saveApprovalOutboxMessage(
    approvalEventPayload: OrderApprovalEventPayload,
    orderStatus: OrderStatus,
    sagaStatus: SagaStatus,
    outboxStatus: OutboxStatus,
    sagaId: string
  ): Promise<void> {
    await this.save(
      new OrderApprovalOutboxMessage(
        uuidv4(),
        sagaId,
        approvalEventPayload.createdAt,
        undefined,
        ORDER_SAGA_NAME,
        this.createPayload(approvalEventPayload),
        sagaStatus,
        orderStatus,
        outboxStatus,
        0
      )
    );
  }

  private createPayload(approvalEventPayload: OrderApprovalEventPayload): string {
    try {
      return JSON.stringify(approvalEventPayload);
    } catch (e) {
      console.error('Could not create OrderApprovalEventPayload object for order id:', approvalEventPayload.orderId, e);
      throw new OrderDomainException('Could not create OrderApprovalEventPayload object for order id: ' + approvalEventPayload.orderId);
    }
  }
}
