import { OrderOutboxMessage } from '../../../outbox/OrderOutboxMessage';

export interface PaymentResponseMessagePublisher {
  publish(
    orderOutboxMessage: OrderOutboxMessage,
    outboxCallback: (outboxMessage: OrderOutboxMessage) => Promise<void>
  ): Promise<void>;
}
