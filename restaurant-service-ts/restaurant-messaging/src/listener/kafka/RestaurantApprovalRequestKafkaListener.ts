import { EachMessagePayload } from 'kafkajs';
import {
  RestaurantApprovalRequestMessageListener,
  RestaurantApplicationServiceException,
} from '@food-ordering-system/restaurant-application-service';
import { RestaurantNotFoundException } from '@food-ordering-system/restaurant-domain-core';
import { RestaurantMessagingDataMapper, RestaurantApprovalRequestAvroModel } from '../../mapper/RestaurantMessagingDataMapper';
import { Logger } from '@food-ordering-system/kafka-producer';

/**
 * Restaurant Approval Request Kafka Listener
 * Consumes restaurant-approval-request messages from Kafka
 * Implements idempotency via unique constraint checking
 */
export class RestaurantApprovalRequestKafkaListener {
  private readonly logger: Logger;

  constructor(
    private readonly restaurantApprovalRequestMessageListener: RestaurantApprovalRequestMessageListener,
    private readonly restaurantMessagingDataMapper: RestaurantMessagingDataMapper,
  ) {
    this.logger = new Logger('RestaurantApprovalRequestKafkaListener');
  }

  /**
   * Process (consume) Kafka message
   * @param payload Kafka message payload
   */
  async consume(payload: EachMessagePayload): Promise<void> {
    const { message, partition, topic } = payload;

    try {
      // Deserialize message value (Avro model)
      const value = message.value;
      if (!value) {
        this.logger.warn('Received null message value');
        return;
      }

      const avroModel: RestaurantApprovalRequestAvroModel = JSON.parse(value.toString());
      const key = message.key?.toString() || '';

      this.logger.info(
        `Received order approval request with key: ${key}, partition: ${partition}, topic: ${topic}`,
      );

      await this.processApprovalRequest(avroModel);
    } catch (error) {
      this.logger.error(`Error processing message from topic ${topic}:`, error);
      throw error;
    }
  }

  /**
   * Process a single approval request
   * @param avroModel Avro model from Kafka
   */
  private async processApprovalRequest(avroModel: RestaurantApprovalRequestAvroModel): Promise<void> {
    try {
      this.logger.info(`Processing order approval for order id: ${avroModel.orderId}`);

      const approvalRequest = this.restaurantMessagingDataMapper.restaurantApprovalRequestAvroModelToRestaurantApproval(
        avroModel,
      );

      await this.restaurantApprovalRequestMessageListener.approveOrder(approvalRequest);
    } catch (error: any) {
      // Handle unique constraint violations (idempotency)
      if (error.code === '23505') {
        // PostgreSQL unique violation error code
        this.logger.error(
          `Caught unique constraint exception for order id: ${avroModel.orderId}. Message already processed.`,
        );
        // NO-OP for unique constraint - message already processed
        return;
      }

      // Handle restaurant not found
      if (error instanceof RestaurantNotFoundException) {
        this.logger.error(
          `No restaurant found for restaurant id: ${avroModel.restaurantId}, and order id: ${avroModel.orderId}`,
        );
        // NO-OP for restaurant not found
        return;
      }

      // Re-throw other errors
      this.logger.error(`Error processing approval request for order id: ${avroModel.orderId}`, error);
      throw new RestaurantApplicationServiceException(
        `Error in RestaurantApprovalRequestKafkaListener: ${error.message}`,
      );
    }
  }
}
