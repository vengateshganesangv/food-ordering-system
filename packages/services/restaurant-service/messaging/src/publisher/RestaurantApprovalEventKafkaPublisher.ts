import { injectable, inject } from 'tsyringe';
import { Producer } from 'kafkajs';
import { RestaurantApprovalResponseMessagePublisher, OrderOutboxMessage, OrderEventPayload } from '@food-ordering-system/restaurant-application-service';
import { RestaurantMessagingDataMapper } from '../mapper/RestaurantMessagingDataMapper';

@injectable()
export class RestaurantApprovalEventKafkaPublisher implements RestaurantApprovalResponseMessagePublisher {
  constructor(
    private readonly restaurantMessagingDataMapper: RestaurantMessagingDataMapper,
    @inject('KafkaProducer')
    private readonly producer: Producer,
    @inject('RestaurantApprovalResponseTopicName')
    private readonly restaurantApprovalResponseTopicName: string
  ) {}

  async publish(
    orderOutboxMessage: OrderOutboxMessage,
    outboxCallback: (outboxMessage: OrderOutboxMessage) => Promise<void>
  ): Promise<void> {
    const orderEventPayload: OrderEventPayload = JSON.parse(orderOutboxMessage.payload);
    const sagaId = orderOutboxMessage.sagaId;

    console.log(`Received OrderOutboxMessage for order id: ${orderEventPayload.orderId} and saga id: ${sagaId}`);

    try {
      const restaurantApprovalResponseAvroModel =
        this.restaurantMessagingDataMapper.orderEventPayloadToRestaurantApprovalResponseAvroModel(
          sagaId,
          orderEventPayload
        );

      await this.producer.send({
        topic: this.restaurantApprovalResponseTopicName,
        messages: [
          {
            key: sagaId,
            value: JSON.stringify(restaurantApprovalResponseAvroModel),
          },
        ],
      });

      console.log(`RestaurantApprovalResponseAvroModel sent to kafka for order id: ${orderEventPayload.orderId} and saga id: ${sagaId}`);

      await outboxCallback(orderOutboxMessage);
    } catch (error) {
      console.error(
        `Error while sending RestaurantApprovalResponseAvroModel message to kafka ` +
        `with order id: ${orderEventPayload.orderId} and saga id: ${sagaId}, error: ${error}`
      );
      throw error;
    }
  }
}
