import { PaymentStatus } from '@food-ordering-system/common-domain';
export declare class PaymentEntity {
    id: string;
    customerId: string;
    orderId: string;
    price: number;
    status: PaymentStatus;
    createdAt: Date;
}
