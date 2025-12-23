import { OutboxScheduler, OutboxStatus } from '@food-ordering-system/outbox';
import { OrderOutboxHelper } from './OrderOutboxHelper';
import { PaymentResponseMessagePublisher } from '../../ports/output/message/publisher/PaymentResponseMessagePublisher';

export class OrderOutboxScheduler implements OutboxScheduler {
  constructor(
    private readonly orderOutboxHelper: OrderOutboxHelper,
    private readonly paymentResponseMessagePublisher: PaymentResponseMessagePublisher
  ) {}

  async processOutboxMessage(): Promise<void> {
    const outboxMessagesResponse = await this.orderOutboxHelper.getOrderOutboxMessageByOutboxStatus(
      OutboxStatus.STARTED
    );

    if (outboxMessagesResponse && outboxMessagesResponse.length > 0) {
      const outboxMessages = outboxMessagesResponse;
      console.log(
        `Received ${outboxMessages.length} OrderOutboxMessage with ids ${outboxMessages
          .map((msg) => msg.id)
          .join(',')}, sending to message bus!`
      );

      for (const orderOutboxMessage of outboxMessages) {
        await this.paymentResponseMessagePublisher.publish(
          orderOutboxMessage,
          this.orderOutboxHelper.updateOutboxMessage.bind(this.orderOutboxHelper)
        );
      }

      console.log(`${outboxMessages.length} OrderOutboxMessage sent to message bus!`);
    }
  }
}
