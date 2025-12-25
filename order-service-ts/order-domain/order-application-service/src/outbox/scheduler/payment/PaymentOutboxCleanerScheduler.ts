import { OutboxScheduler } from '@food-ordering-system/outbox';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { SagaStatus } from '@food-ordering-system/saga';
import { PaymentOutboxHelper } from './PaymentOutboxHelper';

/**
 * Payment Outbox Cleaner Scheduler
 * Cleans up completed payment outbox messages
 */
export class PaymentOutboxCleanerScheduler implements OutboxScheduler {
  private static readonly logger = {
    info: (message: string, ...args: any[]) => console.log(`[PaymentOutboxCleanerScheduler] ${message}`, ...args),
  };

  constructor(private readonly paymentOutboxHelper: PaymentOutboxHelper) {}

  async processOutboxMessage(): Promise<void> {
    const outboxMessagesResponse =
      await this.paymentOutboxHelper.getPaymentOutboxMessageByOutboxStatusAndSagaStatus(
        OutboxStatus.COMPLETED,
        SagaStatus.SUCCEEDED,
        SagaStatus.FAILED,
        SagaStatus.COMPENSATED,
      );

    if (outboxMessagesResponse && outboxMessagesResponse.length > 0) {
      const outboxMessages = outboxMessagesResponse;
      PaymentOutboxCleanerScheduler.logger.info(
        `Received ${outboxMessages.length} OrderPaymentOutboxMessage for clean-up. The payloads: ${outboxMessages.map((m) => m.getPayload()).join('\n')}`,
      );

      await this.paymentOutboxHelper.deletePaymentOutboxMessageByOutboxStatusAndSagaStatus(
        OutboxStatus.COMPLETED,
        SagaStatus.SUCCEEDED,
        SagaStatus.FAILED,
        SagaStatus.COMPENSATED,
      );

      PaymentOutboxCleanerScheduler.logger.info(`${outboxMessages.length} OrderPaymentOutboxMessage deleted!`);
    }
  }
}
