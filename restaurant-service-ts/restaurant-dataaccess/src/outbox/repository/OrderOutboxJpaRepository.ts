import { Repository } from 'typeorm';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { OrderOutboxEntity } from '../entity/OrderOutboxEntity';

/**
 * Order Outbox JPA Repository Interface
 * Extends TypeORM Repository with custom query methods for outbox pattern
 */
export interface OrderOutboxJpaRepository extends Repository<OrderOutboxEntity> {
  /**
   * Find outbox messages by type and status
   * @param type Saga type
   * @param outboxStatus Outbox status
   * @returns List of outbox messages wrapped in Optional
   */
  findByTypeAndOutboxStatus(type: string, outboxStatus: OutboxStatus): Promise<OrderOutboxEntity[] | undefined>;

  /**
   * Find a single outbox message by type, saga ID, and status
   * @param type Saga type
   * @param sagaId Saga identifier
   * @param outboxStatus Outbox status
   * @returns Outbox message wrapped in Optional
   */
  findByTypeAndSagaIdAndOutboxStatus(
    type: string,
    sagaId: string,
    outboxStatus: OutboxStatus,
  ): Promise<OrderOutboxEntity | undefined>;

  /**
   * Delete outbox messages by type and status
   * @param type Saga type
   * @param outboxStatus Outbox status
   */
  deleteByTypeAndOutboxStatus(type: string, outboxStatus: OutboxStatus): Promise<void>;
}

/**
 * Custom repository implementation for OrderOutboxEntity
 * Provides custom query methods beyond standard TypeORM Repository
 */
export class OrderOutboxJpaRepositoryImpl {
  constructor(private repository: Repository<OrderOutboxEntity>) {}

  async findByTypeAndOutboxStatus(type: string, outboxStatus: OutboxStatus): Promise<OrderOutboxEntity[] | undefined> {
    const results = await this.repository.find({
      where: {
        type,
        outboxStatus,
      },
    });
    return results.length > 0 ? results : undefined;
  }

  async findByTypeAndSagaIdAndOutboxStatus(
    type: string,
    sagaId: string,
    outboxStatus: OutboxStatus,
  ): Promise<OrderOutboxEntity | undefined> {
    const result = await this.repository.findOne({
      where: {
        type,
        sagaId,
        outboxStatus,
      },
    });
    return result ?? undefined;
  }

  async deleteByTypeAndOutboxStatus(type: string, outboxStatus: OutboxStatus): Promise<void> {
    await this.repository.delete({
      type,
      outboxStatus,
    });
  }

  // Proxy all standard Repository methods
  save(entity: OrderOutboxEntity): Promise<OrderOutboxEntity> {
    return this.repository.save(entity);
  }

  find(options?: any): Promise<OrderOutboxEntity[]> {
    return this.repository.find(options);
  }

  findOne(options?: any): Promise<OrderOutboxEntity | null> {
    return this.repository.findOne(options);
  }
}
