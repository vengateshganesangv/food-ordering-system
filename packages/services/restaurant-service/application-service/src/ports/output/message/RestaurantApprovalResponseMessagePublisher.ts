import { OrderOutboxMessage } from '../../../outbox/OrderOutboxMessage';

export interface RestaurantApprovalResponseMessagePublisher {
  publish(
    orderOutboxMessage: OrderOutboxMessage,
    outboxCallback: (outboxMessage: OrderOutboxMessage) => Promise<void>
  ): Promise<void>;
}
