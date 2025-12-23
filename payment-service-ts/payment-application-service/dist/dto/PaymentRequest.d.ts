import { PaymentOrderStatus } from '@food-ordering-system/common-domain';
export declare class PaymentRequest {
    id: string;
    sagaId: string;
    orderId: string;
    customerId: string;
    price: number;
    createdAt: Date;
    paymentOrderStatus: PaymentOrderStatus;
    constructor(id: string, sagaId: string, orderId: string, customerId: string, price: number, createdAt: Date, paymentOrderStatus: PaymentOrderStatus);
    setPaymentOrderStatus(paymentOrderStatus: PaymentOrderStatus): void;
}
