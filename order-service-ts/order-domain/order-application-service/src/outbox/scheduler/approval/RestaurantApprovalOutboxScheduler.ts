import { OutboxScheduler } from '@food-ordering-system/outbox';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { SagaStatus } from '@food-ordering-system/saga';
import { ApprovalOutboxHelper } from './ApprovalOutboxHelper';
import { OrderApprovalOutboxMessage } from '../../model/approval/OrderApprovalOutboxMessage';
import { RestaurantApprovalRequestMessagePublisher } from '../../../ports/output/message/publisher/restaurantapproval/RestaurantApprovalRequestMessagePublisher';

/**
 * Restaurant Approval Outbox Scheduler
 * Processes approval outbox messages and publishes them to Kafka
 */
export class RestaurantApprovalOutboxScheduler implements OutboxScheduler {
  private static readonly logger = {
    info: (message: string, ...args: any[]) => console.log(`[RestaurantApprovalOutboxScheduler] ${message}`, ...args),
    error: (message: string, ...args: any[]) =>
      console.error(`[RestaurantApprovalOutboxScheduler] ${message}`, ...args),
  };

  constructor(
    private readonly approvalOutboxHelper: ApprovalOutboxHelper,
    private readonly restaurantApprovalRequestMessagePublisher: RestaurantApprovalRequestMessagePublisher,
  ) {}

  async processOutboxMessage(): Promise<void> {
    const outboxMessagesResponse =
      await this.approvalOutboxHelper.getApprovalOutboxMessageByOutboxStatusAndSagaStatus(
        OutboxStatus.STARTED,
        SagaStatus.PROCESSING,
      );

    if (outboxMessagesResponse && outboxMessagesResponse.length > 0) {
      const outboxMessages = outboxMessagesResponse;
      RestaurantApprovalOutboxScheduler.logger.info(
        `Received ${outboxMessages.length} OrderApprovalOutboxMessage with ids: ${outboxMessages.map((m) => m.getId()).join(',')}, sending to message bus!`,
      );

      for (const outboxMessage of outboxMessages) {
        await this.restaurantApprovalRequestMessagePublisher.publish(
          outboxMessage,
          this.updateOutboxStatus.bind(this),
        );
      }

      RestaurantApprovalOutboxScheduler.logger.info(
        `${outboxMessages.length} OrderApprovalOutboxMessage sent to message bus!`,
      );
    }
  }

  private async updateOutboxStatus(
    orderApprovalOutboxMessage: OrderApprovalOutboxMessage,
    outboxStatus: OutboxStatus,
  ): Promise<void> {
    orderApprovalOutboxMessage.setOutboxStatus(outboxStatus);
    await this.approvalOutboxHelper.save(orderApprovalOutboxMessage);
    RestaurantApprovalOutboxScheduler.logger.info(
      `OrderApprovalOutboxMessage is updated with outbox status: ${outboxStatus}`,
    );
  }
}
