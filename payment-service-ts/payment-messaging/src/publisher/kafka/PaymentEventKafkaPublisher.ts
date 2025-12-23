import { OutboxStatus } from '@food-ordering-system/outbox';
import { KafkaMessageHelper, Logger } from '@food-ordering-system/kafka-producer';
import {
  PaymentResponseMessagePublisher,
  OrderOutboxMessage,
  OrderEventPayload,
  PaymentServiceConfigData
} from '@food-ordering-system/payment-application-service';
import { PaymentMessagingDataMapper, PaymentResponseAvroModel } from '../../mapper/PaymentMessagingDataMapper';
import { IKafkaProducer } from '@food-ordering-system/kafka-producer';

export class PaymentEventKafkaPublisher implements PaymentResponseMessagePublisher {
  private logger = new Logger('PaymentEventKafkaPublisher');

  constructor(
    private readonly paymentMessagingDataMapper: PaymentMessagingDataMapper,
    private readonly kafkaProducer: IKafkaProducer<string, PaymentResponseAvroModel>,
    private readonly paymentServiceConfigData: PaymentServiceConfigData,
    private readonly kafkaMessageHelper: KafkaMessageHelper
  ) {}

  public publish(
    orderOutboxMessage: OrderOutboxMessage,
    outboxCallback: (orderOutboxMessage: OrderOutboxMessage, outboxStatus: OutboxStatus) => void
  ): void {
    const orderEventPayload: OrderEventPayload = this.kafkaMessageHelper.getOrderEventPayload(
      orderOutboxMessage.payload,
      OrderEventPayload
    );

    const sagaId = orderOutboxMessage.sagaId;

    this.logger.info(`Received OrderOutboxMessage for order id: ${orderEventPayload.orderId} and saga id: ${sagaId}`);

    try {
      const paymentResponseAvroModel = this.paymentMessagingDataMapper.orderEventPayloadToPaymentResponseAvroModel(
        sagaId,
        orderEventPayload
      );

      this.kafkaProducer.send(
        this.paymentServiceConfigData.paymentResponseTopicName,
        sagaId,
        paymentResponseAvroModel,
        this.kafkaMessageHelper.getKafkaCallback(
          this.paymentServiceConfigData.paymentResponseTopicName,
          paymentResponseAvroModel,
          orderOutboxMessage,
          outboxCallback,
          orderEventPayload.orderId,
          'PaymentResponseAvroModel'
        )
      );

      this.logger.info(
        `PaymentResponseAvroModel sent to kafka for order id: ${paymentResponseAvroModel.orderId} and saga id: ${sagaId}`
      );
    } catch (error) {
      this.logger.error(
        `Error while sending PaymentResponseAvroModel message to kafka with order id: ${orderEventPayload.orderId} and saga id: ${sagaId}, error: ${error}`
      );
    }
  }
}
