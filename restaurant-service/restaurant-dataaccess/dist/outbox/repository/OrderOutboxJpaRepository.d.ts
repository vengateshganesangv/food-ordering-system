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
    findByTypeAndSagaIdAndOutboxStatus(type: string, sagaId: string, outboxStatus: OutboxStatus): Promise<OrderOutboxEntity | undefined>;
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
export declare class OrderOutboxJpaRepositoryImpl {
    private repository;
    constructor(repository: Repository<OrderOutboxEntity>);
    findByTypeAndOutboxStatus(type: string, outboxStatus: OutboxStatus): Promise<OrderOutboxEntity[] | undefined>;
    findByTypeAndSagaIdAndOutboxStatus(type: string, sagaId: string, outboxStatus: OutboxStatus): Promise<OrderOutboxEntity | undefined>;
    deleteByTypeAndOutboxStatus(type: string, outboxStatus: OutboxStatus): Promise<void>;
    save(entity: OrderOutboxEntity): Promise<OrderOutboxEntity>;
    find(options?: any): Promise<OrderOutboxEntity[]>;
    findOne(options?: any): Promise<OrderOutboxEntity | null>;
}
