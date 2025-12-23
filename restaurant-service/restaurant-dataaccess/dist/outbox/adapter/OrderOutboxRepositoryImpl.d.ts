import { OutboxStatus } from '@food-ordering-system/outbox';
import { OrderOutboxMessage, OrderOutboxRepository } from '@food-ordering-system/restaurant-application-service';
import { OrderOutboxJpaRepositoryImpl } from '../repository/OrderOutboxJpaRepository';
import { OrderOutboxDataAccessMapper } from '../mapper/OrderOutboxDataAccessMapper';
/**
 * Order Outbox Repository Implementation
 * Adapter that implements the OrderOutboxRepository output port
 * Uses TypeORM for database operations with custom query methods
 */
export declare class OrderOutboxRepositoryImpl implements OrderOutboxRepository {
    private readonly orderOutboxJpaRepository;
    private readonly orderOutboxDataAccessMapper;
    constructor(orderOutboxJpaRepository: OrderOutboxJpaRepositoryImpl, orderOutboxDataAccessMapper: OrderOutboxDataAccessMapper);
    /**
     * Save outbox message to database
     * @param orderOutboxMessage Domain outbox message
     * @returns Saved outbox message, or null if save failed
     */
    save(orderOutboxMessage: OrderOutboxMessage): Promise<OrderOutboxMessage | null>;
    /**
     * Find outbox messages by type and status
     * @param sagaType SAGA type identifier
     * @param outboxStatus Outbox status to filter by
     * @returns List of outbox messages, or undefined if none found
     * @throws OrderOutboxNotFoundException if no messages found
     */
    findByTypeAndOutboxStatus(sagaType: string, outboxStatus: OutboxStatus): Promise<OrderOutboxMessage[] | undefined>;
    /**
     * Find a single outbox message by type, saga ID, and status
     * @param type SAGA type identifier
     * @param sagaId SAGA instance identifier
     * @param outboxStatus Outbox status to filter by
     * @returns Outbox message, or undefined if not found
     */
    findByTypeAndSagaIdAndOutboxStatus(type: string, sagaId: string, outboxStatus: OutboxStatus): Promise<OrderOutboxMessage | undefined>;
    /**
     * Delete outbox messages by type and status
     * @param type SAGA type identifier
     * @param outboxStatus Outbox status to filter by
     */
    deleteByTypeAndOutboxStatus(type: string, outboxStatus: OutboxStatus): Promise<void>;
}
