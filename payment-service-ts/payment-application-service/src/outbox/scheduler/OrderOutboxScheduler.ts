import { OutboxStatus } from '@food-ordering-system/outbox';
import { Logger } from '@food-ordering-system/kafka-producer';
import { OrderOutboxMessage } from '../model/OrderOutboxMessage';
import { PaymentResponseMessagePublisher } from '../../ports/output/message/publisher/PaymentResponseMessagePublisher';
import { OrderOutboxHelper } from './OrderOutboxHelper';

const logger = new Logger('OrderOutboxScheduler');

export class OrderOutboxScheduler {
  constructor(
    private readonly orderOutboxHelper: OrderOutboxHelper,
    private readonly paymentResponseMessagePublisher: PaymentResponseMessagePublisher
  ) {}

  public async processOutboxMessage(): Promise<void> {
    const outboxMessages = await this.orderOutboxHelper.getOrderOutboxMessageByOutboxStatus(OutboxStatus.STARTED);

    if (outboxMessages && outboxMessages.length > 0) {
      logger.info(
        `Received ${outboxMessages.length} OrderOutboxMessage with ids ${outboxMessages.map(m => m.id).join(',')}, sending to message bus!`
      );

      outboxMessages.forEach(orderOutboxMessage => {
        this.paymentResponseMessagePublisher.publish(
          orderOutboxMessage,
          this.orderOutboxHelper.updateOutboxMessage.bind(this.orderOutboxHelper)
        );
      });

      logger.info(`${outboxMessages.length} OrderOutboxMessage sent to message bus!`);
    }
  }
}
