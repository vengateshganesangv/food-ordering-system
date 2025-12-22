import { CustomerId, Money, OrderId } from '@food-ordering-system/common-domain';
import { Payment, PaymentEvent } from '@food-ordering-system/payment-domain-core';
import { PaymentRequest } from '../dto/PaymentRequest';
import { OrderEventPayload } from '../outbox/model/OrderEventPayload';

export class PaymentDataMapper {
  public paymentRequestModelToPayment(paymentRequest: PaymentRequest): Payment {
    return Payment.builder()
      .setOrderId(new OrderId(paymentRequest.orderId))
      .setCustomerId(new CustomerId(paymentRequest.customerId))
      .setPrice(new Money(paymentRequest.price))
      .build();
  }

  public paymentEventToOrderEventPayload(paymentEvent: PaymentEvent): OrderEventPayload {
    return new OrderEventPayload(
      paymentEvent.getPayment().getId()!.getValue(),
      paymentEvent.getPayment().getCustomerId().getValue(),
      paymentEvent.getPayment().getOrderId().getValue(),
      paymentEvent.getPayment().getPrice().getAmount(),
      paymentEvent.getCreatedAt(),
      paymentEvent.getPayment().getPaymentStatus()!.toString(),
      paymentEvent.getFailureMessages()
    );
  }
}
