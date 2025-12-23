import { Payment } from '@food-ordering-system/payment-domain-core';
import { PaymentEntity } from '../entity/PaymentEntity';
export declare class PaymentDataAccessMapper {
    paymentToPaymentEntity(payment: Payment): PaymentEntity;
    paymentEntityToPayment(paymentEntity: PaymentEntity): Payment;
}
