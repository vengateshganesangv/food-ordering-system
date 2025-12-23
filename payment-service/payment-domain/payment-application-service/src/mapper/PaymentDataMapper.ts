import { CustomerId, Money, OrderId } from '@food-ordering-system/common-domain';
import { PaymentRequest } from '../dto/PaymentRequest';
import { Payment, PaymentEvent } from '@food-ordering-system/payment-domain-core';
import { OrderEventPayload } from '../outbox/model/OrderEventPayload';

export class PaymentDataMapper {
  paymentRequestModelToPayment(paymentRequest: PaymentRequest): Payment {
    return Payment.builder()
      .setOrderId(new OrderId(paymentRequest.orderId))
      .setCustomerId(new CustomerId(paymentRequest.customerId))
      .setPrice(new Money(paymentRequest.price))
      .build();
  }

  paymentEventToOrderEventPayload(paymentEvent: PaymentEvent): OrderEventPayload {
    return OrderEventPayload.builder()
      .paymentId(paymentEvent.getPayment().getId()!.getValue())
      .customerId(paymentEvent.getPayment().getCustomerId().getValue())
      .orderId(paymentEvent.getPayment().getOrderId().getValue())
      .price(paymentEvent.getPayment().getPrice().getAmount())
      .createdAt(paymentEvent.getCreatedAt())
      .paymentStatus(paymentEvent.getPayment().getPaymentStatus()?.toString() || '')
      .failureMessages(paymentEvent.getFailureMessages())
      .build();
  }
}
