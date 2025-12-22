import { CustomerId, Money, OrderId } from '@food-ordering-system/common-domain';
import { Payment, PaymentId } from '@food-ordering-system/payment-domain-core';
import { PaymentEntity } from '../entity/PaymentEntity';

export class PaymentDataAccessMapper {
  public paymentToPaymentEntity(payment: Payment): PaymentEntity {
    const entity = new PaymentEntity();
    entity.id = payment.getId()!.getValue();
    entity.customerId = payment.getCustomerId().getValue();
    entity.orderId = payment.getOrderId().getValue();
    entity.price = payment.getPrice().getAmount();
    entity.status = payment.getPaymentStatus()!;
    entity.createdAt = payment.getCreatedAt()!;
    return entity;
  }

  public paymentEntityToPayment(paymentEntity: PaymentEntity): Payment {
    return Payment.builder()
      .setPaymentId(new PaymentId(paymentEntity.id))
      .setCustomerId(new CustomerId(paymentEntity.customerId))
      .setOrderId(new OrderId(paymentEntity.orderId))
      .setPrice(new Money(paymentEntity.price))
      .setPaymentStatus(paymentEntity.status)
      .setCreatedAt(paymentEntity.createdAt)
      .build();
  }
}
