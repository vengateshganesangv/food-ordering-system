import { OutboxStatus } from '@food-ordering-system/outbox';
import { OrderApprovalStatus } from '@food-ordering-system/common-domain';
/**
 * Order Outbox Entity - TypeORM entity for restaurant.order_outbox table
 * Implements the Outbox pattern for reliable message publishing
 */
export declare class OrderOutboxEntity {
    id: string;
    sagaId: string;
    createdAt: Date;
    processedAt?: Date;
    type: string;
    payload: string;
    outboxStatus: OutboxStatus;
    approvalStatus: OrderApprovalStatus;
    version: number;
    equals(other: OrderOutboxEntity | null | undefined): boolean;
    hashCode(): number;
}
