import { IKafkaProducer, KafkaMessageHelper, Logger } from '@food-ordering-system/kafka-producer';
import { OutboxStatus } from '@food-ordering-system/outbox';
import {
  RestaurantApprovalResponseMessagePublisher,
  OrderOutboxMessage,
  OrderEventPayload,
  RestaurantServiceConfigData,
} from '@food-ordering-system/restaurant-application-service';
import { RestaurantMessagingDataMapper, RestaurantApprovalResponseAvroModel } from '../../mapper/RestaurantMessagingDataMapper';

/**
 * Restaurant Approval Event Kafka Publisher
 * Publishes restaurant-approval-response messages to Kafka
 * Implements the RestaurantApprovalResponseMessagePublisher output port
 */
export class RestaurantApprovalEventKafkaPublisher implements RestaurantApprovalResponseMessagePublisher {
  private readonly logger: Logger;

  constructor(
    private readonly restaurantMessagingDataMapper: RestaurantMessagingDataMapper,
    private readonly kafkaProducer: IKafkaProducer<string, RestaurantApprovalResponseAvroModel>,
    private readonly restaurantServiceConfigData: RestaurantServiceConfigData,
    private readonly kafkaMessageHelper: KafkaMessageHelper,
  ) {
    this.logger = new Logger('RestaurantApprovalEventKafkaPublisher');
  }

  /**
   * Publish restaurant approval response to Kafka
   * @param orderOutboxMessage Outbox message containing the event
   * @param outboxCallback Callback to update outbox status
   */
  async publish(
    orderOutboxMessage: OrderOutboxMessage,
    outboxCallback: (message: OrderOutboxMessage, status: OutboxStatus) => Promise<void>,
  ): Promise<void> {
    const orderEventPayload: OrderEventPayload = JSON.parse(orderOutboxMessage.getPayload());

    const sagaId = orderOutboxMessage.getSagaId();

    this.logger.info(`Received OrderOutboxMessage for order id: ${orderEventPayload.orderId} and saga id: ${sagaId}`);

    try {
      const restaurantApprovalResponseAvroModel =
        this.restaurantMessagingDataMapper.orderEventPayloadToRestaurantApprovalResponseAvroModel(
          sagaId,
          orderEventPayload,
        );

      const topicName = this.restaurantServiceConfigData.restaurantApprovalResponseTopicName;

      await this.kafkaProducer.send(
        topicName,
        sagaId,
        restaurantApprovalResponseAvroModel,
        this.kafkaMessageHelper.getKafkaCallback(
          topicName,
          restaurantApprovalResponseAvroModel,
          orderOutboxMessage,
          outboxCallback,
          orderEventPayload.orderId,
          'RestaurantApprovalResponseAvroModel',
        ),
      );

      this.logger.info(
        `RestaurantApprovalResponseAvroModel sent to kafka for order id: ${restaurantApprovalResponseAvroModel.orderId} and saga id: ${sagaId}`,
      );
    } catch (error: any) {
      this.logger.error(
        `Error while sending RestaurantApprovalResponseAvroModel to kafka for order id: ${orderEventPayload.orderId} and saga id: ${sagaId}`,
        error,
      );
      throw error;
    }
  }
}
