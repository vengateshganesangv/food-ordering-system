import { OutboxStatus } from '@food-ordering-system/common-domain';
import { OrderPaymentOutboxMessage } from '../../../../../outbox/model/payment/OrderPaymentOutboxMessage';

/**
 * Payment Request Message Publisher interface
 * Output port for publishing payment request messages
 */
export interface PaymentRequestMessagePublisher {
  /**
   * Publishes a payment request message to Kafka
   * @param orderPaymentOutboxMessage Outbox message to publish
   * @param outboxCallback Callback to update outbox status
   */
  publish(
    orderPaymentOutboxMessage: OrderPaymentOutboxMessage,
    outboxCallback: (message: OrderPaymentOutboxMessage, status: OutboxStatus) => Promise<void>,
  ): Promise<void>;
}
