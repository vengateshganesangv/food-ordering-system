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
    constructor(id: string, sagaId: string, createdAt: Date, processedAt: Date, type: string, payload: string, paymentStatus: PaymentStatus, outboxStatus: OutboxStatus, version: number);
    setOutboxStatus(outboxStatus: OutboxStatus): void;
    static builder(): OrderOutboxMessageBuilder;
}
export declare class OrderOutboxMessageBuilder {
    private id?;
    private sagaId?;
    private createdAt?;
    private processedAt?;
    private type?;
    private payload?;
    private paymentStatus?;
    private outboxStatus?;
    private version;
    setId(id: string): OrderOutboxMessageBuilder;
    setSagaId(sagaId: string): OrderOutboxMessageBuilder;
    setCreatedAt(createdAt: Date): OrderOutboxMessageBuilder;
    setProcessedAt(processedAt: Date): OrderOutboxMessageBuilder;
    setType(type: string): OrderOutboxMessageBuilder;
    setPayload(payload: string): OrderOutboxMessageBuilder;
    setPaymentStatus(paymentStatus: PaymentStatus): OrderOutboxMessageBuilder;
    setOutboxStatus(outboxStatus: OutboxStatus): OrderOutboxMessageBuilder;
    setVersion(version: number): OrderOutboxMessageBuilder;
    build(): OrderOutboxMessage;
}
