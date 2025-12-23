export declare class OrderEventPayload {
    paymentId: string;
    customerId: string;
    orderId: string;
    price: number;
    createdAt: Date;
    paymentStatus: string;
    failureMessages: string[];
    constructor();
    static builder(): OrderEventPayloadBuilder;
}
declare class OrderEventPayloadBuilder {
    private payload;
    constructor();
    paymentId(paymentId: string): OrderEventPayloadBuilder;
    customerId(customerId: string): OrderEventPayloadBuilder;
    orderId(orderId: string): OrderEventPayloadBuilder;
    price(price: number): OrderEventPayloadBuilder;
    createdAt(createdAt: Date): OrderEventPayloadBuilder;
    paymentStatus(paymentStatus: string): OrderEventPayloadBuilder;
    failureMessages(failureMessages: string[]): OrderEventPayloadBuilder;
    build(): OrderEventPayload;
}
export {};
//# sourceMappingURL=OrderEventPayload.d.ts.map