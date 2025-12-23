import { PaymentStatus } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';
export declare class OrderOutboxEntity {
    id: string;
    sagaId: string;
    createdAt: Date;
    processedAt: Date;
    type: string;
    payload: string;
    outboxStatus: OutboxStatus;
    paymentStatus: PaymentStatus;
    version: number;
}
