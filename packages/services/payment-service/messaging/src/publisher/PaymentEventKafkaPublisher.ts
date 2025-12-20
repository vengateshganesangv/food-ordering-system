import { injectable, inject } from 'tsyringe';
import { Producer } from 'kafkajs';
import { PaymentResponseMessagePublisher, OrderOutboxMessage, OrderEventPayload } from '@food-ordering-system/payment-application-service';
import { PaymentMessagingDataMapper } from '../mapper/PaymentMessagingDataMapper';

@injectable()
export class PaymentEventKafkaPublisher implements PaymentResponseMessagePublisher {
  constructor(
    private readonly paymentMessagingDataMapper: PaymentMessagingDataMapper,
    @inject('KafkaProducer')
    private readonly producer: Producer,
    @inject('PaymentResponseTopicName')
    private readonly paymentResponseTopicName: string
  ) {}

  async publish(
    orderOutboxMessage: OrderOutboxMessage,
    outboxCallback: (outboxMessage: OrderOutboxMessage) => Promise<void>
  ): Promise<void> {
    const orderEventPayload: OrderEventPayload = JSON.parse(orderOutboxMessage.payload);
    const sagaId = orderOutboxMessage.sagaId;

    console.log(`Received OrderOutboxMessage for order id: ${orderEventPayload.orderId} and saga id: ${sagaId}`);

    try {
      const paymentResponseAvroModel = this.paymentMessagingDataMapper.orderEventPayloadToPaymentResponseAvroModel(
        sagaId,
        orderEventPayload
      );

      await this.producer.send({
        topic: this.paymentResponseTopicName,
        messages: [
          {
            key: sagaId,
            value: JSON.stringify(paymentResponseAvroModel),
          },
        ],
      });

      console.log(`PaymentResponseAvroModel sent to kafka for order id: ${orderEventPayload.orderId} and saga id: ${sagaId}`);

      await outboxCallback(orderOutboxMessage);
    } catch (error) {
      console.error(
        `Error while sending PaymentResponseAvroModel message to kafka ` +
        `with order id: ${orderEventPayload.orderId} and saga id: ${sagaId}, error: ${error}`
      );
      throw error;
    }
  }
}
