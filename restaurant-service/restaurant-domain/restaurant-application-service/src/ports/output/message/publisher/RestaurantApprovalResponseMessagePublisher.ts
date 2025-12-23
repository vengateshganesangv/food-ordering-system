import { OutboxStatus } from '@food-ordering-system/outbox';
import { OrderOutboxMessage } from '../../../../outbox/model/OrderOutboxMessage';

/**
 * Restaurant Approval Response Message Publisher (Output Port)
 * Interface for publishing restaurant approval responses to message broker
 */
export interface RestaurantApprovalResponseMessagePublisher {
  /**
   * Publish outbox message with callback for status update
   * @param orderOutboxMessage The outbox message to publish
   * @param outboxCallback Callback to update outbox status after publishing
   */
  publish(
    orderOutboxMessage: OrderOutboxMessage,
    outboxCallback: (message: OrderOutboxMessage, status: OutboxStatus) => Promise<void>,
  ): Promise<void>;
}
