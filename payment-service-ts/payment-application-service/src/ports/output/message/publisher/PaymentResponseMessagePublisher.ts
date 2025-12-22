import { OutboxStatus } from '@food-ordering-system/common-domain';
import { OrderOutboxMessage } from '../../../../outbox/model/OrderOutboxMessage';

export interface PaymentResponseMessagePublisher {
  publish(
    orderOutboxMessage: OrderOutboxMessage,
    outboxCallback: (orderOutboxMessage: OrderOutboxMessage, outboxStatus: OutboxStatus) => void
  ): void;
}
