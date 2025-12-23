import { AggregateRoot, CustomerId, Money, OrderId, PaymentStatus } from '@food-ordering-system/common-domain';
import { PaymentId } from '../valueobject/PaymentId';
export interface PaymentProps {
    paymentId?: PaymentId;
    orderId: OrderId;
    customerId: CustomerId;
    price: Money;
    paymentStatus?: PaymentStatus;
    createdAt?: Date;
}
export declare class Payment extends AggregateRoot<PaymentId> {
    private readonly orderId;
    private readonly customerId;
    private readonly price;
    private paymentStatus?;
    private createdAt?;
    constructor(props: PaymentProps);
    initializePayment(): void;
    validatePayment(failureMessages: string[]): void;
    updateStatus(paymentStatus: PaymentStatus): void;
    static builder(): PaymentBuilder;
    getOrderId(): OrderId;
    getCustomerId(): CustomerId;
    getPrice(): Money;
    getPaymentStatus(): PaymentStatus | undefined;
    getCreatedAt(): Date | undefined;
}
export declare class PaymentBuilder {
    private paymentId?;
    private orderId?;
    private customerId?;
    private price?;
    private paymentStatus?;
    private createdAt?;
    setPaymentId(paymentId: PaymentId): PaymentBuilder;
    setOrderId(orderId: OrderId): PaymentBuilder;
    setCustomerId(customerId: CustomerId): PaymentBuilder;
    setPrice(price: Money): PaymentBuilder;
    setPaymentStatus(paymentStatus: PaymentStatus): PaymentBuilder;
    setCreatedAt(createdAt: Date): PaymentBuilder;
    build(): Payment;
}
//# sourceMappingURL=Payment.d.ts.map