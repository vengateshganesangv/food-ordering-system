import { injectable, inject } from 'tsyringe';
import { Consumer, EachMessagePayload } from 'kafkajs';
import { RestaurantApprovalRequestMessageListener } from '@food-ordering-system/restaurant-application-service';
import { RestaurantMessagingDataMapper, RestaurantApprovalRequestAvroModel } from '../mapper/RestaurantMessagingDataMapper';

@injectable()
export class RestaurantApprovalRequestKafkaListener {
  constructor(
    @inject('RestaurantApprovalRequestMessageListener')
    private readonly restaurantApprovalRequestMessageListener: RestaurantApprovalRequestMessageListener,
    private readonly restaurantMessagingDataMapper: RestaurantMessagingDataMapper,
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

    console.log(`RestaurantApprovalRequestKafkaListener started for topic: ${topic}, group: ${groupId}`);
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
      const restaurantApprovalRequestAvroModel: RestaurantApprovalRequestAvroModel = JSON.parse(value);

      console.log(
        `Processing restaurant approval request for order id: ${restaurantApprovalRequestAvroModel.orderId}, ` +
        `key: ${key}, partition: ${partition}, offset: ${message.offset}`
      );

      await this.restaurantApprovalRequestMessageListener.approveOrder(
        this.restaurantMessagingDataMapper.restaurantApprovalRequestAvroModelToRestaurantApproval(
          restaurantApprovalRequestAvroModel
        )
      );
    } catch (error) {
      console.error(`Error processing restaurant approval request: ${error}`);
      throw error;
    }
  }
}
