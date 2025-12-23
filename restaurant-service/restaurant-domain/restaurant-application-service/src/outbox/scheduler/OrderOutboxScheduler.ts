import { OutboxScheduler, OutboxStatus } from '@food-ordering-system/outbox';
import { OrderOutboxMessage } from '../model/OrderOutboxMessage';
import { RestaurantApprovalResponseMessagePublisher } from '../../ports/output/message/publisher/RestaurantApprovalResponseMessagePublisher';
import { OrderOutboxHelper } from './OrderOutboxHelper';
import { Logger } from '@food-ordering-system/kafka-producer';

/**
 * Order Outbox Scheduler
 * Processes STARTED outbox messages and publishes them to Kafka
 */
export class OrderOutboxScheduler implements OutboxScheduler {
  private readonly logger: Logger;

  constructor(
    private readonly orderOutboxHelper: OrderOutboxHelper,
    private readonly responseMessagePublisher: RestaurantApprovalResponseMessagePublisher,
    logger?: Logger,
  ) {
    this.logger = logger || console;
  }

  /**
   * Process outbox messages with STARTED status
   * Scheduled to run at fixed intervals
   */
  async processOutboxMessage(): Promise<void> {
    const outboxMessagesResponse =
      await this.orderOutboxHelper.getOrderOutboxMessageByOutboxStatus(OutboxStatus.STARTED);

    if (outboxMessagesResponse && outboxMessagesResponse.length > 0) {
      const outboxMessages = outboxMessagesResponse;
      const messageIds = outboxMessages.map((msg) => msg.getId()).join(',');

      this.logger.info(
        `Received ${outboxMessages.length} OrderOutboxMessage with ids ${messageIds}, sending to message bus!`,
      );

      for (const orderOutboxMessage of outboxMessages) {
        await this.responseMessagePublisher.publish(
          orderOutboxMessage,
          this.orderOutboxHelper.updateOutboxStatus.bind(this.orderOutboxHelper),
        );
      }

      this.logger.info(`${outboxMessages.length} OrderOutboxMessage sent to message bus!`);
    }
  }
}
