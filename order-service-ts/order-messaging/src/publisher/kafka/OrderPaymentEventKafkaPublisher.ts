import {
  OrderPaymentOutboxMessage,
  PaymentRequestMessagePublisher,
  OrderServiceConfigData,
  OrderPaymentEventPayload,
} from '@food-ordering-system/order-application-service';
import { IKafkaProducer, KafkaMessageHelper, Logger } from '@food-ordering-system/kafka-producer';
import { PaymentRequestAvroModel } from '@food-ordering-system/kafka-model';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { OrderMessagingDataMapper } from '../../mapper/OrderMessagingDataMapper';

export class OrderPaymentEventKafkaPublisher implements PaymentRequestMessagePublisher {
  private static readonly logger = new Logger('OrderPaymentEventKafkaPublisher');

  constructor(
    private orderMessagingDataMapper: OrderMessagingDataMapper,
    private kafkaProducer: IKafkaProducer<string, PaymentRequestAvroModel>,
    private orderServiceConfigData: OrderServiceConfigData,
    private kafkaMessageHelper: KafkaMessageHelper,
  ) {}

  async publish(
    orderPaymentOutboxMessage: OrderPaymentOutboxMessage,
    outboxCallback: (message: OrderPaymentOutboxMessage, status: OutboxStatus) => Promise<void>,
  ): Promise<void> {
    const orderPaymentEventPayload = this.kafkaMessageHelper.getOrderEventPayload(
      orderPaymentOutboxMessage.getPayload(),
      OrderPaymentEventPayload,
    );

    const sagaId = orderPaymentOutboxMessage.getSagaId();

    OrderPaymentEventKafkaPublisher.logger.info(
      `Received OrderPaymentOutboxMessage for order id: ${orderPaymentEventPayload.getOrderId()} and saga id: ${sagaId}`,
    );

    try {
      const paymentRequestAvroModel = this.orderMessagingDataMapper.orderPaymentEventToPaymentRequestAvroModel(
        sagaId,
        orderPaymentEventPayload,
      );

      await this.kafkaProducer.send(
        this.orderServiceConfigData.getPaymentRequestTopicName(),
        sagaId,
        paymentRequestAvroModel,
        this.kafkaMessageHelper.getKafkaCallback(
          this.orderServiceConfigData.getPaymentRequestTopicName(),
          paymentRequestAvroModel,
          orderPaymentOutboxMessage,
          outboxCallback,
          orderPaymentEventPayload.getOrderId(),
          'PaymentRequestAvroModel',
        ),
      );

      OrderPaymentEventKafkaPublisher.logger.info(
        `OrderPaymentEventPayload sent to Kafka for order id: ${orderPaymentEventPayload.getOrderId()} and saga id: ${sagaId}`,
      );
    } catch (e) {
      OrderPaymentEventKafkaPublisher.logger.error(
        `Error while sending OrderPaymentEventPayload to kafka with order id: ${orderPaymentEventPayload.getOrderId()} and saga id: ${sagaId}, error: ${(e as Error).message}`,
      );
    }
  }
}
