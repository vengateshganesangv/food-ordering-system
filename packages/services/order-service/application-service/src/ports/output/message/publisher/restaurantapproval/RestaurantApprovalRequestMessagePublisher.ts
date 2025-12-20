import { OutboxStatus } from '@food-ordering-system/outbox';
import { OrderApprovalOutboxMessage } from '../../../../../outbox/model/approval/OrderApprovalOutboxMessage';

export interface RestaurantApprovalRequestMessagePublisher {
  publish(
    orderApprovalOutboxMessage: OrderApprovalOutboxMessage,
    outboxCallback: (message: OrderApprovalOutboxMessage, status: OutboxStatus) => void
  ): void;
}
