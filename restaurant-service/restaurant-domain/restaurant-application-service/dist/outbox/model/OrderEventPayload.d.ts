import { OrderApprovalStatus } from '@food-ordering-system/common-domain';
/**
 * Order Event Payload
 * Contains the payload data for outbox messages
 */
export interface OrderEventPayload {
    orderId: string;
    restaurantId: string;
    createdAt: Date;
    orderApprovalStatus: OrderApprovalStatus;
    failureMessages: string[];
}
/**
 * Builder for OrderEventPayload
 */
export declare class OrderEventPayloadBuilder {
    private _orderId?;
    private _restaurantId?;
    private _createdAt?;
    private _orderApprovalStatus?;
    private _failureMessages;
    orderId(value: string): this;
    restaurantId(value: string): this;
    createdAt(value: Date): this;
    orderApprovalStatus(value: OrderApprovalStatus): this;
    failureMessages(value: string[]): this;
    build(): OrderEventPayload;
}
//# sourceMappingURL=OrderEventPayload.d.ts.map