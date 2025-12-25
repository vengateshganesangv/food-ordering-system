import { v4 as uuidv4 } from 'uuid';
import { OrderStatus, ORDER_SAGA_NAME } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { SagaStatus } from '@food-ordering-system/saga';
import { OrderDomainException } from '@food-ordering-system/order-domain-core';
import { OrderApprovalEventPayload } from '../../model/approval/OrderApprovalEventPayload';
import { OrderApprovalOutboxMessage } from '../../model/approval/OrderApprovalOutboxMessage';
import { ApprovalOutboxRepository } from '../../../ports/output/repository/ApprovalOutboxRepository';

/**
 * Approval Outbox Helper
 * Helper class for managing approval outbox messages
 */
export class ApprovalOutboxHelper {
  private static readonly logger = {
    info: (message: string, ...args: any[]) => console.log(`[ApprovalOutboxHelper] ${message}`, ...args),
    error: (message: string, ...args: any[]) => console.error(`[ApprovalOutboxHelper] ${message}`, ...args),
  };

  constructor(private readonly approvalOutboxRepository: ApprovalOutboxRepository) {}

  async getApprovalOutboxMessageByOutboxStatusAndSagaStatus(
    outboxStatus: OutboxStatus,
    ...sagaStatus: SagaStatus[]
  ): Promise<OrderApprovalOutboxMessage[] | undefined> {
    return this.approvalOutboxRepository.findByTypeAndOutboxStatusAndSagaStatus(
      ORDER_SAGA_NAME,
      outboxStatus,
      sagaStatus,
    );
  }

  async getApprovalOutboxMessageBySagaIdAndSagaStatus(
    sagaId: string,
    ...sagaStatus: SagaStatus[]
  ): Promise<OrderApprovalOutboxMessage | undefined> {
    return this.approvalOutboxRepository.findByTypeAndSagaIdAndSagaStatus(ORDER_SAGA_NAME, sagaId, sagaStatus);
  }

  async save(orderApprovalOutboxMessage: OrderApprovalOutboxMessage): Promise<void> {
    const response = await this.approvalOutboxRepository.save(orderApprovalOutboxMessage);
    if (!response) {
      ApprovalOutboxHelper.logger.error(
        `Could not save OrderApprovalOutboxMessage with outbox id: ${orderApprovalOutboxMessage.getId()}`,
      );
      throw new OrderDomainException(
        `Could not save OrderApprovalOutboxMessage with outbox id: ${orderApprovalOutboxMessage.getId()}`,
      );
    }
    ApprovalOutboxHelper.logger.info(
      `OrderApprovalOutboxMessage saved with outbox id: ${orderApprovalOutboxMessage.getId()}`,
    );
  }

  async saveApprovalOutboxMessage(
    orderApprovalEventPayload: OrderApprovalEventPayload,
    orderStatus: OrderStatus,
    sagaStatus: SagaStatus,
    outboxStatus: OutboxStatus,
    sagaId: string,
  ): Promise<void> {
    await this.save(
      OrderApprovalOutboxMessage.builder()
        .id(uuidv4())
        .sagaId(sagaId)
        .createdAt(orderApprovalEventPayload.createdAt)
        .type(ORDER_SAGA_NAME)
        .payload(this.createPayload(orderApprovalEventPayload))
        .orderStatus(orderStatus)
        .sagaStatus(sagaStatus)
        .outboxStatus(outboxStatus)
        .version(0)
        .build(),
    );
  }

  async deleteApprovalOutboxMessageByOutboxStatusAndSagaStatus(
    outboxStatus: OutboxStatus,
    ...sagaStatus: SagaStatus[]
  ): Promise<void> {
    await this.approvalOutboxRepository.deleteByTypeAndOutboxStatusAndSagaStatus(
      ORDER_SAGA_NAME,
      outboxStatus,
      sagaStatus,
    );
  }

  private createPayload(orderApprovalEventPayload: OrderApprovalEventPayload): string {
    try {
      return JSON.stringify(orderApprovalEventPayload);
    } catch (error) {
      ApprovalOutboxHelper.logger.error(
        `Could not create OrderApprovalEventPayload for order id: ${orderApprovalEventPayload.orderId}`,
        error,
      );
      throw new OrderDomainException(
        `Could not create OrderApprovalEventPayload for order id: ${orderApprovalEventPayload.orderId}`,
      );
    }
  }
}
