import { IKafkaConsumer } from '@food-ordering-system/kafka-consumer';
import { RestaurantApprovalResponseAvroModel } from '@food-ordering-system/kafka-model';
import { RestaurantApprovalResponseMessageListener } from '@food-ordering-system/order-application-service';
import { OrderMessagingDataMapper } from '../../mapper/OrderMessagingDataMapper';
import { Logger } from '@food-ordering-system/kafka-producer';

const FAILURE_MESSAGE_DELIMITER = ',';

export class RestaurantApprovalResponseKafkaListener
  implements IKafkaConsumer<RestaurantApprovalResponseAvroModel>
{
  private static readonly logger = new Logger('RestaurantApprovalResponseKafkaListener');

  constructor(
    private restaurantApprovalResponseMessageListener: RestaurantApprovalResponseMessageListener,
    private orderMessagingDataMapper: OrderMessagingDataMapper,
  ) {}

  async receive(
    messages: RestaurantApprovalResponseAvroModel[],
    keys: string[],
    partitions: number[],
    offsets: number[],
  ): Promise<void> {
    for (let i = 0; i < messages.length; i++) {
      const restaurantApprovalResponseAvroModel = messages[i];
      const key = keys[i];
      const partition = partitions[i];
      const offset = offsets[i];

      RestaurantApprovalResponseKafkaListener.logger.info(
        `Received restaurant approval response with key ${key}, partition ${partition} and offset ${offset}`,
      );

      try {
        if (restaurantApprovalResponseAvroModel.orderApprovalStatus === 'APPROVED') {
          RestaurantApprovalResponseKafkaListener.logger.info(
            `Processing approved order for order id: ${restaurantApprovalResponseAvroModel.orderId}`,
          );
          await this.restaurantApprovalResponseMessageListener.orderApproved(
            this.orderMessagingDataMapper.approvalResponseAvroModelToApprovalResponse(
              restaurantApprovalResponseAvroModel,
            ),
          );
        } else if (restaurantApprovalResponseAvroModel.orderApprovalStatus === 'REJECTED') {
          RestaurantApprovalResponseKafkaListener.logger.info(
            `Processing rejected order for order id: ${restaurantApprovalResponseAvroModel.orderId}, with failure messages: ${restaurantApprovalResponseAvroModel.failureMessages.join(FAILURE_MESSAGE_DELIMITER)}`,
          );
          await this.restaurantApprovalResponseMessageListener.orderRejected(
            this.orderMessagingDataMapper.approvalResponseAvroModelToApprovalResponse(
              restaurantApprovalResponseAvroModel,
            ),
          );
        }
      } catch (error) {
        if ((error as Error).name === 'OptimisticLockingFailureException') {
          // NO-OP for optimistic lock. This means another thread finished the work
          RestaurantApprovalResponseKafkaListener.logger.error(
            `Caught optimistic locking exception in RestaurantApprovalResponseKafkaListener for order id: ${restaurantApprovalResponseAvroModel.orderId}`,
          );
        } else if ((error as Error).name === 'OrderNotFoundException') {
          // NO-OP for OrderNotFoundException
          RestaurantApprovalResponseKafkaListener.logger.error(
            `No order found for order id: ${restaurantApprovalResponseAvroModel.orderId}`,
          );
        } else {
          throw error;
        }
      }
    }
  }

  getGroupId(): string {
    return 'order-service-restaurant-approval-group';
  }

  getTopics(): string[] {
    return ['restaurant-approval-response'];
  }
}
