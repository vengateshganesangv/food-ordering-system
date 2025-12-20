import { OutboxStatus } from '@food-ordering-system/outbox';
import { OrderPaymentOutboxMessage } from '../../../../../outbox/model/payment/OrderPaymentOutboxMessage';

export interface PaymentRequestMessagePublisher {
  publish(
    orderPaymentOutboxMessage: OrderPaymentOutboxMessage,
    outboxCallback: (message: OrderPaymentOutboxMessage, status: OutboxStatus) => void
  ): void;
}
