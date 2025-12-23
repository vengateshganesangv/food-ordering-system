export declare class OrderEventPayload {
    paymentId: string;
    customerId: string;
    orderId: string;
    price: number;
    createdAt: Date;
    paymentStatus: string;
    failureMessages: string[];
    constructor(paymentId: string, customerId: string, orderId: string, price: number, createdAt: Date, paymentStatus: string, failureMessages: string[]);
}
