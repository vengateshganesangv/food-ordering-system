import { OutboxStatus } from '@food-ordering-system/outbox';
import { OrderApprovalOutboxMessage } from '../../../../../outbox/model/approval/OrderApprovalOutboxMessage';

/**
 * Restaurant Approval Request Message Publisher interface
 * Output port for publishing restaurant approval request messages
 */
export interface RestaurantApprovalRequestMessagePublisher {
  /**
   * Publishes a restaurant approval request message to Kafka
   * @param orderApprovalOutboxMessage Outbox message to publish
   * @param outboxCallback Callback to update outbox status
   */
  publish(
    orderApprovalOutboxMessage: OrderApprovalOutboxMessage,
    outboxCallback: (message: OrderApprovalOutboxMessage, status: OutboxStatus) => Promise<void>,
  ): Promise<void>;
}
