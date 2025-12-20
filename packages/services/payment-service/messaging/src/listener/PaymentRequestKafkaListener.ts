import { injectable, inject } from 'tsyringe';
import { Consumer, EachMessagePayload } from 'kafkajs';
import { PaymentOrderStatus } from '@food-ordering-system/common-domain';
import { PaymentRequestMessageListener } from '@food-ordering-system/payment-application-service';
import { PaymentNotFoundException } from '@food-ordering-system/payment-domain-core';
import { PaymentMessagingDataMapper, PaymentRequestAvroModel } from '../mapper/PaymentMessagingDataMapper';

@injectable()
export class PaymentRequestKafkaListener {
  constructor(
    @inject('PaymentRequestMessageListener')
    private readonly paymentRequestMessageListener: PaymentRequestMessageListener,
    private readonly paymentMessagingDataMapper: PaymentMessagingDataMapper,
    @inject('KafkaConsumer')
    private readonly consumer: Consumer
  ) {}

  async listen(topic: string, groupId: string): Promise<void> {
    await this.consumer.subscribe({ topic, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        await this.handleMessage(payload);
      },
    });

    console.log(`PaymentRequestKafkaListener started for topic: ${topic}, group: ${groupId}`);
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;
    const key = message.key?.toString();
    const value = message.value?.toString();

    if (!value) {
      console.warn('Received message with no value');
      return;
    }

    try {
      const paymentRequestAvroModel: PaymentRequestAvroModel = JSON.parse(value);

      console.log(
        `Processing payment request for order id: ${paymentRequestAvroModel.orderId}, ` +
        `key: ${key}, partition: ${partition}, offset: ${message.offset}`
      );

      if (paymentRequestAvroModel.paymentOrderStatus === PaymentOrderStatus.PENDING.toString()) {
        console.log(`Processing payment for order id: ${paymentRequestAvroModel.orderId}`);
        await this.paymentRequestMessageListener.completePayment(
          this.paymentMessagingDataMapper.paymentRequestAvroModelToPaymentRequest(paymentRequestAvroModel)
        );
      } else if (paymentRequestAvroModel.paymentOrderStatus === PaymentOrderStatus.CANCELLED.toString()) {
        console.log(`Cancelling payment for order id: ${paymentRequestAvroModel.orderId}`);
        await this.paymentRequestMessageListener.cancelPayment(
          this.paymentMessagingDataMapper.paymentRequestAvroModelToPaymentRequest(paymentRequestAvroModel)
        );
      }
    } catch (error) {
      if (error instanceof PaymentNotFoundException) {
        console.error(`No payment found for message: ${key}`);
      } else {
        console.error(`Error processing payment request: ${error}`);
        throw error;
      }
    }
  }
}
