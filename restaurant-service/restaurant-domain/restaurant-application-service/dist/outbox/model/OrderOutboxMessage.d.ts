import { OrderApprovalStatus } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';
/**
 * Order Outbox Message
 * Represents an outbox message for reliable messaging
 */
export declare class OrderOutboxMessage {
    private id;
    private sagaId;
    private createdAt;
    private processedAt;
    private type;
    private payload;
    private outboxStatus;
    private approvalStatus;
    private version;
    constructor(id: string, sagaId: string, createdAt: Date, processedAt: Date | null, type: string, payload: string, outboxStatus: OutboxStatus, approvalStatus: OrderApprovalStatus, version: number);
    getId(): string;
    getSagaId(): string;
    getCreatedAt(): Date;
    getProcessedAt(): Date | null;
    getType(): string;
    getPayload(): string;
    getOutboxStatus(): OutboxStatus;
    getApprovalStatus(): OrderApprovalStatus;
    getVersion(): number;
    setOutboxStatus(status: OutboxStatus): void;
    static Builder: {
        new (): {
            _id?: string;
            _sagaId?: string;
            _createdAt?: Date;
            _processedAt: Date | null;
            _type?: string;
            _payload?: string;
            _outboxStatus?: OutboxStatus;
            _approvalStatus?: OrderApprovalStatus;
            _version: number;
            id(value: string): /*elided*/ any;
            sagaId(value: string): /*elided*/ any;
            createdAt(value: Date): /*elided*/ any;
            processedAt(value: Date | null): /*elided*/ any;
            type(value: string): /*elided*/ any;
            payload(value: string): /*elided*/ any;
            outboxStatus(value: OutboxStatus): /*elided*/ any;
            approvalStatus(value: OrderApprovalStatus): /*elided*/ any;
            version(value: number): /*elided*/ any;
            build(): OrderOutboxMessage;
        };
    };
}
export declare const OrderOutboxMessageBuilder: {
    new (): {
        _id?: string;
        _sagaId?: string;
        _createdAt?: Date;
        _processedAt: Date | null;
        _type?: string;
        _payload?: string;
        _outboxStatus?: OutboxStatus;
        _approvalStatus?: OrderApprovalStatus;
        _version: number;
        id(value: string): /*elided*/ any;
        sagaId(value: string): /*elided*/ any;
        createdAt(value: Date): /*elided*/ any;
        processedAt(value: Date | null): /*elided*/ any;
        type(value: string): /*elided*/ any;
        payload(value: string): /*elided*/ any;
        outboxStatus(value: OutboxStatus): /*elided*/ any;
        approvalStatus(value: OrderApprovalStatus): /*elided*/ any;
        version(value: number): /*elided*/ any;
        build(): OrderOutboxMessage;
    };
};
//# sourceMappingURL=OrderOutboxMessage.d.ts.map