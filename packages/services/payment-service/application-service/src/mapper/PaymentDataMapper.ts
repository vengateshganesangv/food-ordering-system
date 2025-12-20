import { injectable } from 'tsyringe';
import { CustomerId, Money, OrderId } from '@food-ordering-system/common-domain';
import { Payment, PaymentEvent } from '@food-ordering-system/payment-domain-core';
import { PaymentRequest } from '../dto/PaymentRequest';
import { OrderEventPayload } from '../outbox/OrderEventPayload';

@injectable()
export class PaymentDataMapper {
  paymentRequestModelToPayment(paymentRequest: PaymentRequest): Payment {
    return Payment.builder()
      .setOrderId(new OrderId(paymentRequest.orderId))
      .setCustomerId(new CustomerId(paymentRequest.customerId))
      .setPrice(new Money(paymentRequest.price))
      .build();
  }

  paymentEventToOrderEventPayload(paymentEvent: PaymentEvent): OrderEventPayload {
    return new OrderEventPayload({
      paymentId: paymentEvent.payment.getId()!.getValue(),
      customerId: paymentEvent.payment.customerId.getValue(),
      orderId: paymentEvent.payment.orderId.getValue(),
      price: paymentEvent.payment.price.getAmount(),
      createdAt: paymentEvent.createdAt,
      paymentStatus: paymentEvent.payment.paymentStatus!.toString(),
      failureMessages: paymentEvent.failureMessages,
    });
  }
}
