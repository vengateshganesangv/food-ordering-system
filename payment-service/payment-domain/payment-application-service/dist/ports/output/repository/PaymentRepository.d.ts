import { Payment } from '@food-ordering-system/payment-domain-core';
export interface PaymentRepository {
    save(payment: Payment): Promise<Payment>;
    findByOrderId(orderId: string): Promise<Payment | null>;
}
//# sourceMappingURL=PaymentRepository.d.ts.map