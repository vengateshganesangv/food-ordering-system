import { KafkaConsumer } from '@food-ordering-system/kafka-consumer';
import { PaymentResponseAvroModel } from '@food-ordering-system/kafka-model';
import { PaymentResponseMessageListener } from '@food-ordering-system/order-application-service';
import { OrderMessagingDataMapper } from '../../mapper/OrderMessagingDataMapper';
import { Logger } from '@food-ordering-system/common-domain';
import { EachMessagePayload } from 'kafkajs';

export class PaymentResponseKafkaListener implements KafkaConsumer<PaymentResponseAvroModel> {
  private static readonly logger = new Logger('PaymentResponseKafkaListener');

  constructor(
    private paymentResponseMessageListener: PaymentResponseMessageListener,
    private orderMessagingDataMapper: OrderMessagingDataMapper,
  ) {}

  async receive(payload: EachMessagePayload): Promise<void> {
    const { message, partition } = payload;
    const key = message.key?.toString() || '';
    const offset = message.offset;

    const paymentResponseAvroModel: PaymentResponseAvroModel = JSON.parse(message.value!.toString());

    PaymentResponseKafkaListener.logger.info(
      `Received payment response with key ${key}, partition ${partition} and offset ${offset}`,
    );

    try {
      if (paymentResponseAvroModel.paymentStatus === 'COMPLETED') {
        PaymentResponseKafkaListener.logger.info(
          `Processing successful payment for order id: ${paymentResponseAvroModel.orderId}`,
        );
        await this.paymentResponseMessageListener.paymentCompleted(
          this.orderMessagingDataMapper.paymentResponseAvroModelToPaymentResponse(paymentResponseAvroModel),
        );
      } else if (
        paymentResponseAvroModel.paymentStatus === 'CANCELLED' ||
        paymentResponseAvroModel.paymentStatus === 'FAILED'
      ) {
        PaymentResponseKafkaListener.logger.info(
          `Processing unsuccessful payment for order id: ${paymentResponseAvroModel.orderId}`,
        );
        await this.paymentResponseMessageListener.paymentCancelled(
          this.orderMessagingDataMapper.paymentResponseAvroModelToPaymentResponse(paymentResponseAvroModel),
        );
      }
    } catch (error) {
      if ((error as Error).name === 'OptimisticLockingFailureException') {
        // NO-OP for optimistic lock. This means another thread finished the work
        PaymentResponseKafkaListener.logger.error(
          `Caught optimistic locking exception in PaymentResponseKafkaListener for order id: ${paymentResponseAvroModel.orderId}`,
        );
      } else if ((error as Error).name === 'OrderNotFoundException') {
        // NO-OP for OrderNotFoundException
        PaymentResponseKafkaListener.logger.error(`No order found for order id: ${paymentResponseAvroModel.orderId}`);
      } else {
        throw error;
      }
    }
  }

  getGroupId(): string {
    return 'order-service-payment-group';
  }

  getTopics(): string[] {
    return ['payment-response'];
  }
}
