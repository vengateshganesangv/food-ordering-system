import {
  OrderApprovalOutboxMessage,
  RestaurantApprovalRequestMessagePublisher,
  OrderServiceConfigData,
  OrderApprovalEventPayload,
} from '@food-ordering-system/order-application-service';
import { IKafkaProducer, KafkaMessageHelper, Logger } from '@food-ordering-system/kafka-producer';
import { RestaurantApprovalRequestAvroModel } from '@food-ordering-system/kafka-model';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { OrderMessagingDataMapper } from '../../mapper/OrderMessagingDataMapper';

export class OrderApprovalEventKafkaPublisher implements RestaurantApprovalRequestMessagePublisher {
  private static readonly logger = new Logger('OrderApprovalEventKafkaPublisher');

  constructor(
    private orderMessagingDataMapper: OrderMessagingDataMapper,
    private kafkaProducer: IKafkaProducer<string, RestaurantApprovalRequestAvroModel>,
    private orderServiceConfigData: OrderServiceConfigData,
    private kafkaMessageHelper: KafkaMessageHelper,
  ) {}

  async publish(
    orderApprovalOutboxMessage: OrderApprovalOutboxMessage,
    outboxCallback: (message: OrderApprovalOutboxMessage, status: OutboxStatus) => Promise<void>,
  ): Promise<void> {
    const orderApprovalEventPayload = this.kafkaMessageHelper.getOrderEventPayload(
      orderApprovalOutboxMessage.getPayload(),
      OrderApprovalEventPayload,
    );

    const sagaId = orderApprovalOutboxMessage.getSagaId();

    OrderApprovalEventKafkaPublisher.logger.info(
      `Received OrderApprovalOutboxMessage for order id: ${orderApprovalEventPayload.orderId} and saga id: ${sagaId}`,
    );

    try {
      const restaurantApprovalRequestAvroModel =
        this.orderMessagingDataMapper.orderApprovalEventToRestaurantApprovalRequestAvroModel(
          sagaId,
          orderApprovalEventPayload,
        );

      await this.kafkaProducer.send(
        this.orderServiceConfigData.restaurantApprovalRequestTopicName,
        sagaId,
        restaurantApprovalRequestAvroModel,
        this.kafkaMessageHelper.getKafkaCallback(
          this.orderServiceConfigData.restaurantApprovalRequestTopicName,
          restaurantApprovalRequestAvroModel,
          orderApprovalOutboxMessage,
          outboxCallback,
          orderApprovalEventPayload.orderId,
          'RestaurantApprovalRequestAvroModel',
        ),
      );

      OrderApprovalEventKafkaPublisher.logger.info(
        `OrderApprovalEventPayload sent to kafka for order id: ${restaurantApprovalRequestAvroModel.orderId} and saga id: ${sagaId}`,
      );
    } catch (e) {
      OrderApprovalEventKafkaPublisher.logger.error(
        `Error while sending OrderApprovalEventPayload to kafka for order id: ${orderApprovalEventPayload.orderId} and saga id: ${sagaId}, error: ${(e as Error).message}`,
      );
    }
  }
}
