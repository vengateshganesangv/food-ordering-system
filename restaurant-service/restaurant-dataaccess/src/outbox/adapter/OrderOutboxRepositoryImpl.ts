import { OutboxStatus } from '@food-ordering-system/outbox';
import { OrderOutboxMessage, OrderOutboxRepository } from '@food-ordering-system/restaurant-application-service';
import { OrderOutboxJpaRepositoryImpl } from '../repository/OrderOutboxJpaRepository';
import { OrderOutboxDataAccessMapper } from '../mapper/OrderOutboxDataAccessMapper';
import { OrderOutboxNotFoundException } from '../exception/OrderOutboxNotFoundException';

/**
 * Order Outbox Repository Implementation
 * Adapter that implements the OrderOutboxRepository output port
 * Uses TypeORM for database operations with custom query methods
 */
export class OrderOutboxRepositoryImpl implements OrderOutboxRepository {
  constructor(
    private readonly orderOutboxJpaRepository: OrderOutboxJpaRepositoryImpl,
    private readonly orderOutboxDataAccessMapper: OrderOutboxDataAccessMapper,
  ) {}

  /**
   * Save outbox message to database
   * @param orderOutboxMessage Domain outbox message
   * @returns Saved outbox message, or null if save failed
   */
  async save(orderOutboxMessage: OrderOutboxMessage): Promise<OrderOutboxMessage | null> {
    const entity = this.orderOutboxDataAccessMapper.orderOutboxMessageToOutboxEntity(orderOutboxMessage);
    const savedEntity = await this.orderOutboxJpaRepository.save(entity);
    return this.orderOutboxDataAccessMapper.orderOutboxEntityToOrderOutboxMessage(savedEntity);
  }

  /**
   * Find outbox messages by type and status
   * @param sagaType SAGA type identifier
   * @param outboxStatus Outbox status to filter by
   * @returns List of outbox messages, or undefined if none found
   * @throws OrderOutboxNotFoundException if no messages found
   */
  async findByTypeAndOutboxStatus(sagaType: string, outboxStatus: OutboxStatus): Promise<OrderOutboxMessage[] | undefined> {
    const entities = await this.orderOutboxJpaRepository.findByTypeAndOutboxStatus(sagaType, outboxStatus);

    if (!entities) {
      throw new OrderOutboxNotFoundException(
        `Approval outbox object cannot be found for saga type ${sagaType}`,
      );
    }

    return entities.map((entity) => this.orderOutboxDataAccessMapper.orderOutboxEntityToOrderOutboxMessage(entity));
  }

  /**
   * Find a single outbox message by type, saga ID, and status
   * @param type SAGA type identifier
   * @param sagaId SAGA instance identifier
   * @param outboxStatus Outbox status to filter by
   * @returns Outbox message, or undefined if not found
   */
  async findByTypeAndSagaIdAndOutboxStatus(
    type: string,
    sagaId: string,
    outboxStatus: OutboxStatus,
  ): Promise<OrderOutboxMessage | undefined> {
    const entity = await this.orderOutboxJpaRepository.findByTypeAndSagaIdAndOutboxStatus(type, sagaId, outboxStatus);

    if (!entity) {
      return undefined;
    }

    return this.orderOutboxDataAccessMapper.orderOutboxEntityToOrderOutboxMessage(entity);
  }

  /**
   * Delete outbox messages by type and status
   * @param type SAGA type identifier
   * @param outboxStatus Outbox status to filter by
   */
  async deleteByTypeAndOutboxStatus(type: string, outboxStatus: OutboxStatus): Promise<void> {
    await this.orderOutboxJpaRepository.deleteByTypeAndOutboxStatus(type, outboxStatus);
  }
}
