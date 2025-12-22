import { logger, PaymentOrderStatus } from '@food-ordering-system/common-domain';
import { KafkaConsumer } from '@food-ordering-system/common-kafka';
import {
  PaymentRequestMessageListener,
  PaymentApplicationServiceException
} from '@food-ordering-system/payment-application-service';
import { PaymentNotFoundException } from '@food-ordering-system/payment-domain-core';
import { PaymentMessagingDataMapper, PaymentRequestAvroModel } from '../../mapper/PaymentMessagingDataMapper';
import { EachMessagePayload } from 'kafkajs';

export class PaymentRequestKafkaListener implements KafkaConsumer {
  constructor(
    private readonly paymentRequestMessageListener: PaymentRequestMessageListener,
    private readonly paymentMessagingDataMapper: PaymentMessagingDataMapper
  ) {}

  public async consume(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;
    const key = message.key?.toString();
    const value = message.value?.toString();

    if (!value) {
      logger.warn('Received empty message');
      return;
    }

    try {
      const paymentRequestAvroModel: PaymentRequestAvroModel = JSON.parse(value);

      logger.info(
        `Processing payment request for order id: ${paymentRequestAvroModel.orderId}, key: ${key}, partition: ${partition}`
      );

      if (paymentRequestAvroModel.paymentOrderStatus === PaymentOrderStatus.PENDING.toString()) {
        logger.info(`Processing payment for order id: ${paymentRequestAvroModel.orderId}`);
        await this.paymentRequestMessageListener.completePayment(
          this.paymentMessagingDataMapper.paymentRequestAvroModelToPaymentRequest(paymentRequestAvroModel)
        );
      } else if (paymentRequestAvroModel.paymentOrderStatus === PaymentOrderStatus.CANCELLED.toString()) {
        logger.info(`Cancelling payment for order id: ${paymentRequestAvroModel.orderId}`);
        await this.paymentRequestMessageListener.cancelPayment(
          this.paymentMessagingDataMapper.paymentRequestAvroModelToPaymentRequest(paymentRequestAvroModel)
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        // Check for unique constraint violation (PostgreSQL error code 23505)
        if (error.message.includes('unique constraint') || error.message.includes('23505')) {
          logger.error(
            `Caught unique constraint exception in PaymentRequestKafkaListener: ${error.message}`
          );
          // NO-OP for unique constraint exception
        } else if (error instanceof PaymentNotFoundException) {
          logger.error(`No payment found: ${error.message}`);
          // NO-OP for PaymentNotFoundException
        } else {
          throw new PaymentApplicationServiceException(
            `Error in PaymentRequestKafkaListener: ${error.message}`,
            error
          );
        }
      } else {
        throw error;
      }
    }
  }
}
