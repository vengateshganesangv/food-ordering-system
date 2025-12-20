import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { CustomerId, Money, OrderId, PaymentStatus } from '@food-ordering-system/common-domain';
import { Payment, PaymentId } from '@food-ordering-system/payment-domain-core';
import { PaymentRepository } from '@food-ordering-system/payment-application-service';
import { PaymentEntity } from '../entity/PaymentEntity';

@injectable()
export class PaymentRepositoryImpl implements PaymentRepository {
  private repository: Repository<PaymentEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = dataSource.getRepository(PaymentEntity);
  }

  async save(payment: Payment): Promise<Payment> {
    const paymentEntity = this.paymentToEntity(payment);
    const saved = await this.repository.save(paymentEntity);
    return this.entityToPayment(saved);
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    const entity = await this.repository.findOne({ where: { orderId } });
    return entity ? this.entityToPayment(entity) : null;
  }

  private paymentToEntity(payment: Payment): PaymentEntity {
    const entity = new PaymentEntity();
    entity.id = payment.getId()!.getValue();
    entity.customerId = payment.customerId.getValue();
    entity.orderId = payment.orderId.getValue();
    entity.price = payment.price.getAmount();
    entity.status = payment.paymentStatus!;
    entity.createdAt = payment.createdAt!;
    return entity;
  }

  private entityToPayment(entity: PaymentEntity): Payment {
    return Payment.builder()
      .setPaymentId(new PaymentId(entity.id))
      .setCustomerId(new CustomerId(entity.customerId))
      .setOrderId(new OrderId(entity.orderId))
      .setPrice(new Money(entity.price))
      .setPaymentStatus(entity.status)
      .setCreatedAt(entity.createdAt)
      .build();
  }
}
