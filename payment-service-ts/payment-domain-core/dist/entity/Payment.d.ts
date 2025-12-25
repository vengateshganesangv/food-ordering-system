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
    private constructor();
    initializePayment(): void;
    validatePayment(failureMessages: string[]): void;
    updateStatus(paymentStatus: PaymentStatus): void;
    getOrderId(): OrderId;
    getCustomerId(): CustomerId;
    getPrice(): Money;
    getPaymentStatus(): PaymentStatus | undefined;
    getCreatedAt(): Date | undefined;
    static builder(): InstanceType<typeof Payment.Builder>;
    static Builder: {
        new (): {
            paymentId?: PaymentId;
            orderId?: OrderId;
            customerId?: CustomerId;
            price?: Money;
            paymentStatus?: PaymentStatus;
            createdAt?: Date;
            setPaymentId(paymentId: PaymentId): /*elided*/ any;
            setOrderId(orderId: OrderId): /*elided*/ any;
            setCustomerId(customerId: CustomerId): /*elided*/ any;
            setPrice(price: Money): /*elided*/ any;
            setPaymentStatus(paymentStatus: PaymentStatus): /*elided*/ any;
            setCreatedAt(createdAt: Date): /*elided*/ any;
            build(): Payment;
        };
    };
}
