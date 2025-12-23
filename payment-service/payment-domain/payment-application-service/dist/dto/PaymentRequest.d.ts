import { PaymentOrderStatus } from '@food-ordering-system/common-domain';
export declare class PaymentRequest {
    id: string;
    sagaId: string;
    orderId: string;
    customerId: string;
    price: number;
    createdAt: Date;
    paymentOrderStatus: PaymentOrderStatus;
    constructor(data?: Partial<PaymentRequest>);
    setPaymentOrderStatus(paymentOrderStatus: PaymentOrderStatus): void;
}
//# sourceMappingURL=PaymentRequest.d.ts.map