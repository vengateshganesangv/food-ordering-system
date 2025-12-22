import { OutboxStatus, logger } from '@food-ordering-system/common-domain';
import { OrderOutboxHelper } from './OrderOutboxHelper';

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
