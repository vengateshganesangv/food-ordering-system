import { OutboxScheduler, OutboxStatus } from '@food-ordering-system/outbox';
import { OrderOutboxHelper } from './OrderOutboxHelper';
import { Logger } from '@food-ordering-system/kafka-producer';

/**
 * Order Outbox Cleaner Scheduler
 * Cleans up COMPLETED outbox messages
 * Runs daily at midnight
 */
export class OrderOutboxCleanerScheduler implements OutboxScheduler {
  private readonly logger: Logger;

  constructor(
    private readonly orderOutboxHelper: OrderOutboxHelper,
    logger?: Logger,
  ) {
    this.logger = logger || console;
  }

  /**
   * Process outbox message cleanup
   * Deletes COMPLETED outbox messages
   * Scheduled to run at midnight (cron: @midnight)
   */
  async processOutboxMessage(): Promise<void> {
    const outboxMessagesResponse =
      await this.orderOutboxHelper.getOrderOutboxMessageByOutboxStatus(OutboxStatus.COMPLETED);

    if (outboxMessagesResponse && outboxMessagesResponse.length > 0) {
      const outboxMessages = outboxMessagesResponse;
      this.logger.info(`Received ${outboxMessages.length} OrderOutboxMessage for clean-up!`);

      await this.orderOutboxHelper.deleteOrderOutboxMessageByOutboxStatus(OutboxStatus.COMPLETED);

      this.logger.info(`Deleted ${outboxMessages.length} OrderOutboxMessage!`);
    }
  }
}
