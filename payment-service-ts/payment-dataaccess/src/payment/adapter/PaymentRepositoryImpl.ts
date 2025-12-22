import { Payment } from '@food-ordering-system/payment-domain-core';
import { PaymentRepository } from '@food-ordering-system/payment-application-service';
import { PaymentJpaRepository } from '../repository/PaymentJpaRepository';
import { PaymentDataAccessMapper } from '../mapper/PaymentDataAccessMapper';

export class PaymentRepositoryImpl implements PaymentRepository {
  constructor(
    private readonly paymentJpaRepository: PaymentJpaRepository,
    private readonly paymentDataAccessMapper: PaymentDataAccessMapper
  ) {}

  public async save(payment: Payment): Promise<Payment> {
    const entity = this.paymentDataAccessMapper.paymentToPaymentEntity(payment);
    const savedEntity = await this.paymentJpaRepository.save(entity);
    return this.paymentDataAccessMapper.paymentEntityToPayment(savedEntity);
  }

  public async findByOrderId(orderId: string): Promise<Payment | null> {
    const entity = await this.paymentJpaRepository.findByOrderId(orderId);
    return entity ? this.paymentDataAccessMapper.paymentEntityToPayment(entity) : null;
  }
}
