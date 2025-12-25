import { OutboxScheduler } from '@food-ordering-system/outbox';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { SagaStatus } from '@food-ordering-system/saga';
import { ApprovalOutboxHelper } from './ApprovalOutboxHelper';

/**
 * Restaurant Approval Outbox Cleaner Scheduler
 * Cleans up completed approval outbox messages
 */
export class RestaurantApprovalOutboxCleanerScheduler implements OutboxScheduler {
  private static readonly logger = {
    info: (message: string, ...args: any[]) =>
      console.log(`[RestaurantApprovalOutboxCleanerScheduler] ${message}`, ...args),
  };

  constructor(private readonly approvalOutboxHelper: ApprovalOutboxHelper) {}

  async processOutboxMessage(): Promise<void> {
    const outboxMessagesResponse =
      await this.approvalOutboxHelper.getApprovalOutboxMessageByOutboxStatusAndSagaStatus(
        OutboxStatus.COMPLETED,
        SagaStatus.SUCCEEDED,
        SagaStatus.FAILED,
        SagaStatus.COMPENSATED,
      );

    if (outboxMessagesResponse && outboxMessagesResponse.length > 0) {
      const outboxMessages = outboxMessagesResponse;
      RestaurantApprovalOutboxCleanerScheduler.logger.info(
        `Received ${outboxMessages.length} OrderApprovalOutboxMessage for clean-up. The payloads: ${outboxMessages.map((m) => m.getPayload()).join('\n')}`,
      );

      await this.approvalOutboxHelper.deleteApprovalOutboxMessageByOutboxStatusAndSagaStatus(
        OutboxStatus.COMPLETED,
        SagaStatus.SUCCEEDED,
        SagaStatus.FAILED,
        SagaStatus.COMPENSATED,
      );

      RestaurantApprovalOutboxCleanerScheduler.logger.info(
        `${outboxMessages.length} OrderApprovalOutboxMessage deleted!`,
      );
    }
  }
}
