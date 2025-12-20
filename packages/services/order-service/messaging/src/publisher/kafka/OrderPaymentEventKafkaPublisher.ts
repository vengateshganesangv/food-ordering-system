import { injectable, inject } from 'tsyringe';
import { PaymentRequestMessagePublisher, OrderPaymentOutboxMessage } from '@food-ordering-system/order-application-service';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { KafkaProducer } from '@food-ordering-system/kafka-producer';

@injectable()
export class OrderPaymentEventKafkaPublisher implements PaymentRequestMessagePublisher {
  constructor(
    @inject('KafkaProducer') private kafkaProducer: KafkaProducer<any>,
    @inject('PaymentRequestTopicName') private paymentRequestTopicName: string
  ) {}

  publish(
    orderPaymentOutboxMessage: OrderPaymentOutboxMessage,
    outboxCallback: (message: OrderPaymentOutboxMessage, status: OutboxStatus) => void
  ): void {
    const payload = JSON.parse(orderPaymentOutboxMessage.payload);
    const sagaId = orderPaymentOutboxMessage.sagaId;

    console.log('Received OrderPaymentOutboxMessage for order id:', payload.orderId, 'and saga id:', sagaId);

    try {
      // Send to Kafka using kafka producer
      this.kafkaProducer.send(this.paymentRequestTopicName, sagaId, payload);
      
      outboxCallback(orderPaymentOutboxMessage, OutboxStatus.COMPLETED);
      console.log('OrderPaymentEventPayload sent to Kafka for order id:', payload.orderId, 'and saga id:', sagaId);
    } catch (error) {
      console.error('Error while sending OrderPaymentEventPayload to kafka with order id:', payload.orderId, 'and saga id:', sagaId, 'error:', error);
      outboxCallback(orderPaymentOutboxMessage, OutboxStatus.FAILED);
    }
  }
}
