import { OutboxScheduler } from '@food-ordering-system/outbox';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { SagaStatus } from '@food-ordering-system/saga';
import { PaymentOutboxHelper } from './PaymentOutboxHelper';
import { OrderPaymentOutboxMessage } from '../../model/payment/OrderPaymentOutboxMessage';
import { PaymentRequestMessagePublisher } from '../../../ports/output/message/publisher/payment/PaymentRequestMessagePublisher';

/**
 * Payment Outbox Scheduler
 * Processes payment outbox messages and publishes them to Kafka
 */
export class PaymentOutboxScheduler implements OutboxScheduler {
  private static readonly logger = {
    info: (message: string, ...args: any[]) => console.log(`[PaymentOutboxScheduler] ${message}`, ...args),
    error: (message: string, ...args: any[]) => console.error(`[PaymentOutboxScheduler] ${message}`, ...args),
  };

  constructor(
    private readonly paymentOutboxHelper: PaymentOutboxHelper,
    private readonly paymentRequestMessagePublisher: PaymentRequestMessagePublisher,
  ) {}

  async processOutboxMessage(): Promise<void> {
    const outboxMessagesResponse =
      await this.paymentOutboxHelper.getPaymentOutboxMessageByOutboxStatusAndSagaStatus(
        OutboxStatus.STARTED,
        SagaStatus.STARTED,
        SagaStatus.COMPENSATING,
      );

    if (outboxMessagesResponse && outboxMessagesResponse.length > 0) {
      const outboxMessages = outboxMessagesResponse;
      PaymentOutboxScheduler.logger.info(
        `Received ${outboxMessages.length} OrderPaymentOutboxMessage with ids: ${outboxMessages.map((m) => m.getId()).join(',')}, sending to message bus!`,
      );

      for (const outboxMessage of outboxMessages) {
        await this.paymentRequestMessagePublisher.publish(
          outboxMessage,
          this.updateOutboxStatus.bind(this),
        );
      }

      PaymentOutboxScheduler.logger.info(`${outboxMessages.length} OrderPaymentOutboxMessage sent to message bus!`);
    }
  }

  private async updateOutboxStatus(
    orderPaymentOutboxMessage: OrderPaymentOutboxMessage,
    outboxStatus: OutboxStatus,
  ): Promise<void> {
    orderPaymentOutboxMessage.setOutboxStatus(outboxStatus);
    await this.paymentOutboxHelper.save(orderPaymentOutboxMessage);
    PaymentOutboxScheduler.logger.info(`OrderPaymentOutboxMessage is updated with outbox status: ${outboxStatus}`);
  }
}
