import { OutboxScheduler, OutboxStatus } from '@food-ordering-system/outbox';
import { OrderOutboxHelper } from './OrderOutboxHelper';

export class OrderOutboxCleanerScheduler implements OutboxScheduler {
  constructor(private readonly orderOutboxHelper: OrderOutboxHelper) {}

  async processOutboxMessage(): Promise<void> {
    const outboxMessagesResponse = await this.orderOutboxHelper.getOrderOutboxMessageByOutboxStatus(
      OutboxStatus.COMPLETED
    );

    if (outboxMessagesResponse && outboxMessagesResponse.length > 0) {
      const outboxMessages = outboxMessagesResponse;
      console.log(`Received ${outboxMessages.length} OrderOutboxMessage for clean-up!`);

      await this.orderOutboxHelper.deleteOrderOutboxMessageByOutboxStatus(OutboxStatus.COMPLETED);

      console.log(`Deleted ${outboxMessages.length} OrderOutboxMessage!`);
    }
  }
}
