import { OrderApprovalStatus, DomainConstants } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { ORDER_SAGA_NAME } from '@food-ordering-system/saga';
import { RestaurantDomainException } from '../../../restaurant-domain-core/src/exception/RestaurantDomainException';
import { OrderEventPayload } from '../model/OrderEventPayload';
import { OrderOutboxMessage } from '../model/OrderOutboxMessage';
import { OrderOutboxRepository } from '../../ports/output/repository/OrderOutboxRepository';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '@food-ordering-system/kafka-producer';

/**
 * Order Outbox Helper
 * Manages CRUD operations for order outbox messages
 */
export class OrderOutboxHelper {
  private readonly logger: Logger;

  constructor(
    private readonly orderOutboxRepository: OrderOutboxRepository,
    logger?: Logger,
  ) {
    this.logger = logger || console;
  }

  /**
   * Get completed outbox message by saga ID and status
   */
  async getCompletedOrderOutboxMessageBySagaIdAndOutboxStatus(
    sagaId: string,
    outboxStatus: OutboxStatus,
  ): Promise<OrderOutboxMessage | undefined> {
    return this.orderOutboxRepository.findByTypeAndSagaIdAndOutboxStatus(
      ORDER_SAGA_NAME,
      sagaId,
      outboxStatus,
    );
  }

  /**
   * Get outbox messages by status
   */
  async getOrderOutboxMessageByOutboxStatus(
    outboxStatus: OutboxStatus,
  ): Promise<OrderOutboxMessage[] | undefined> {
    return this.orderOutboxRepository.findByTypeAndOutboxStatus(ORDER_SAGA_NAME, outboxStatus);
  }

  /**
   * Delete outbox messages by status
   */
  async deleteOrderOutboxMessageByOutboxStatus(outboxStatus: OutboxStatus): Promise<void> {
    await this.orderOutboxRepository.deleteByTypeAndOutboxStatus(ORDER_SAGA_NAME, outboxStatus);
  }

  /**
   * Save a new order outbox message
   */
  async saveOrderOutboxMessage(
    orderEventPayload: OrderEventPayload,
    approvalStatus: OrderApprovalStatus,
    outboxStatus: OutboxStatus,
    sagaId: string,
  ): Promise<void> {
    const message = new OrderOutboxMessage.Builder()
      .id(uuidv4())
      .sagaId(sagaId)
      .createdAt(orderEventPayload.createdAt)
      .processedAt(new Date())
      .type(ORDER_SAGA_NAME)
      .payload(this.createPayload(orderEventPayload))
      .approvalStatus(approvalStatus)
      .outboxStatus(outboxStatus)
      .version(0)
      .build();

    await this.save(message);
  }

  /**
   * Update outbox message status
   */
  async updateOutboxStatus(
    orderOutboxMessage: OrderOutboxMessage,
    outboxStatus: OutboxStatus,
  ): Promise<void> {
    orderOutboxMessage.setOutboxStatus(outboxStatus);
    await this.save(orderOutboxMessage);
    this.logger.info(`Order outbox table status is updated as: ${outboxStatus}`);
  }

  /**
   * Save outbox message to repository
   */
  private async save(orderOutboxMessage: OrderOutboxMessage): Promise<void> {
    const response = await this.orderOutboxRepository.save(orderOutboxMessage);
    if (!response) {
      throw new RestaurantDomainException('Could not save OrderOutboxMessage!');
    }
    this.logger.info(`OrderOutboxMessage saved with id: ${orderOutboxMessage.getId()}`);
  }

  /**
   * Serialize order event payload to JSON string
   */
  private createPayload(orderEventPayload: OrderEventPayload): string {
    try {
      return JSON.stringify(orderEventPayload);
    } catch (error) {
      this.logger.error('Could not create OrderEventPayload json!', error);
      throw new RestaurantDomainException(
        'Could not create OrderEventPayload json!',
        error as Error,
      );
    }
  }
}
