import { Payment } from '@food-ordering-system/payment-domain-core';
import { PaymentRepository } from '@food-ordering-system/payment-application-service';
import { PaymentJpaRepository } from '../repository/PaymentJpaRepository';
import { PaymentDataAccessMapper } from '../mapper/PaymentDataAccessMapper';
export declare class PaymentRepositoryImpl implements PaymentRepository {
    private readonly paymentJpaRepository;
    private readonly paymentDataAccessMapper;
    constructor(paymentJpaRepository: PaymentJpaRepository, paymentDataAccessMapper: PaymentDataAccessMapper);
    save(payment: Payment): Promise<Payment>;
    findByOrderId(orderId: string): Promise<Payment | null>;
}
