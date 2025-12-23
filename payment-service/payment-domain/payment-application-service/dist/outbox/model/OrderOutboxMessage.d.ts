import { PaymentStatus } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';
export declare class OrderOutboxMessage {
    id: string;
    sagaId: string;
    createdAt: Date;
    processedAt: Date;
    type: string;
    payload: string;
    paymentStatus: PaymentStatus;
    outboxStatus: OutboxStatus;
    version: number;
    constructor();
    static builder(): OrderOutboxMessageBuilder;
    setOutboxStatus(outboxStatus: OutboxStatus): void;
}
declare class OrderOutboxMessageBuilder {
    private message;
    constructor();
    id(id: string): OrderOutboxMessageBuilder;
    sagaId(sagaId: string): OrderOutboxMessageBuilder;
    createdAt(createdAt: Date): OrderOutboxMessageBuilder;
    processedAt(processedAt: Date): OrderOutboxMessageBuilder;
    type(type: string): OrderOutboxMessageBuilder;
    payload(payload: string): OrderOutboxMessageBuilder;
    paymentStatus(paymentStatus: PaymentStatus): OrderOutboxMessageBuilder;
    outboxStatus(outboxStatus: OutboxStatus): OrderOutboxMessageBuilder;
    version(version: number): OrderOutboxMessageBuilder;
    build(): OrderOutboxMessage;
}
export {};
//# sourceMappingURL=OrderOutboxMessage.d.ts.map