import { OutboxStatus } from '@food-ordering-system/outbox';
import { Logger } from '@food-ordering-system/kafka-producer';
import { OrderOutboxHelper } from './OrderOutboxHelper';

const logger = new Logger('OrderOutboxCleanerScheduler');

export class OrderOutboxCleanerScheduler {
  constructor(private readonly orderOutboxHelper: OrderOutboxHelper) {}

  public async processOutboxMessage(): Promise<void> {
    const outboxMessages = await this.orderOutboxHelper.getOrderOutboxMessageByOutboxStatus(OutboxStatus.COMPLETED);

    if (outboxMessages && outboxMessages.length > 0) {
      logger.info(`Received ${outboxMessages.length} OrderOutboxMessage for clean-up!`);
      await this.orderOutboxHelper.deleteOrderOutboxMessageByOutboxStatus(OutboxStatus.COMPLETED);
      logger.info(`Deleted ${outboxMessages.length} OrderOutboxMessage!`);
    }
  }
}
