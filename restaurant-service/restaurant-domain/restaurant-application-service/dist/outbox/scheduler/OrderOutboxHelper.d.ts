import { OrderApprovalStatus } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { OrderEventPayload } from '../model/OrderEventPayload';
import { OrderOutboxMessage } from '../model/OrderOutboxMessage';
import { OrderOutboxRepository } from '../../ports/output/repository/OrderOutboxRepository';
import { Logger } from '@food-ordering-system/kafka-producer';
/**
 * Order Outbox Helper
 * Manages CRUD operations for order outbox messages
 */
export declare class OrderOutboxHelper {
    private readonly orderOutboxRepository;
    private readonly logger;
    constructor(orderOutboxRepository: OrderOutboxRepository, logger?: Logger);
    /**
     * Get completed outbox message by saga ID and status
     */
    getCompletedOrderOutboxMessageBySagaIdAndOutboxStatus(sagaId: string, outboxStatus: OutboxStatus): Promise<OrderOutboxMessage | undefined>;
    /**
     * Get outbox messages by status
     */
    getOrderOutboxMessageByOutboxStatus(outboxStatus: OutboxStatus): Promise<OrderOutboxMessage[] | undefined>;
    /**
     * Delete outbox messages by status
     */
    deleteOrderOutboxMessageByOutboxStatus(outboxStatus: OutboxStatus): Promise<void>;
    /**
     * Save a new order outbox message
     */
    saveOrderOutboxMessage(orderEventPayload: OrderEventPayload, approvalStatus: OrderApprovalStatus, outboxStatus: OutboxStatus, sagaId: string): Promise<void>;
    /**
     * Update outbox message status
     */
    updateOutboxStatus(orderOutboxMessage: OrderOutboxMessage, outboxStatus: OutboxStatus): Promise<void>;
    /**
     * Save outbox message to repository
     */
    private save;
    /**
     * Serialize order event payload to JSON string
     */
    private createPayload;
}
//# sourceMappingURL=OrderOutboxHelper.d.ts.map