"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantApprovalRequestKafkaListener = void 0;
const restaurant_application_service_1 = require("@food-ordering-system/restaurant-application-service");
const restaurant_domain_core_1 = require("@food-ordering-system/restaurant-domain-core");
const kafka_producer_1 = require("@food-ordering-system/kafka-producer");
/**
 * Restaurant Approval Request Kafka Listener
 * Consumes restaurant-approval-request messages from Kafka
 * Implements idempotency via unique constraint checking
 */
class RestaurantApprovalRequestKafkaListener {
    constructor(restaurantApprovalRequestMessageListener, restaurantMessagingDataMapper) {
        this.restaurantApprovalRequestMessageListener = restaurantApprovalRequestMessageListener;
        this.restaurantMessagingDataMapper = restaurantMessagingDataMapper;
        this.logger = new kafka_producer_1.Logger('RestaurantApprovalRequestKafkaListener');
    }
    /**
     * Process (consume) Kafka message
     * @param payload Kafka message payload
     */
    async consume(payload) {
        const { message, partition, topic } = payload;
        try {
            // Deserialize message value (Avro model)
            const value = message.value;
            if (!value) {
                this.logger.warn('Received null message value');
                return;
            }
            const avroModel = JSON.parse(value.toString());
            const key = message.key?.toString() || '';
            this.logger.info(`Received order approval request with key: ${key}, partition: ${partition}, topic: ${topic}`);
            await this.processApprovalRequest(avroModel);
        }
        catch (error) {
            this.logger.error(`Error processing message from topic ${topic}:`, error);
            throw error;
        }
    }
    /**
     * Process a single approval request
     * @param avroModel Avro model from Kafka
     */
    async processApprovalRequest(avroModel) {
        try {
            this.logger.info(`Processing order approval for order id: ${avroModel.orderId}`);
            const approvalRequest = this.restaurantMessagingDataMapper.restaurantApprovalRequestAvroModelToRestaurantApproval(avroModel);
            await this.restaurantApprovalRequestMessageListener.approveOrder(approvalRequest);
        }
        catch (error) {
            // Handle unique constraint violations (idempotency)
            if (error.code === '23505') {
                // PostgreSQL unique violation error code
                this.logger.error(`Caught unique constraint exception for order id: ${avroModel.orderId}. Message already processed.`);
                // NO-OP for unique constraint - message already processed
                return;
            }
            // Handle restaurant not found
            if (error instanceof restaurant_domain_core_1.RestaurantNotFoundException) {
                this.logger.error(`No restaurant found for restaurant id: ${avroModel.restaurantId}, and order id: ${avroModel.orderId}`);
                // NO-OP for restaurant not found
                return;
            }
            // Re-throw other errors
            this.logger.error(`Error processing approval request for order id: ${avroModel.orderId}`, error);
            throw new restaurant_application_service_1.RestaurantApplicationServiceException(`Error in RestaurantApprovalRequestKafkaListener: ${error.message}`);
        }
    }
}
exports.RestaurantApprovalRequestKafkaListener = RestaurantApprovalRequestKafkaListener;
