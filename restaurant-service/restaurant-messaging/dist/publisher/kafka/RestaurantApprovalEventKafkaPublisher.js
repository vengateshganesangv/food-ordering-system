"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantApprovalEventKafkaPublisher = void 0;
const kafka_producer_1 = require("@food-ordering-system/kafka-producer");
/**
 * Restaurant Approval Event Kafka Publisher
 * Publishes restaurant-approval-response messages to Kafka
 * Implements the RestaurantApprovalResponseMessagePublisher output port
 */
class RestaurantApprovalEventKafkaPublisher {
    constructor(restaurantMessagingDataMapper, kafkaProducer, restaurantServiceConfigData, kafkaMessageHelper) {
        this.restaurantMessagingDataMapper = restaurantMessagingDataMapper;
        this.kafkaProducer = kafkaProducer;
        this.restaurantServiceConfigData = restaurantServiceConfigData;
        this.kafkaMessageHelper = kafkaMessageHelper;
        this.logger = new kafka_producer_1.Logger('RestaurantApprovalEventKafkaPublisher');
    }
    /**
     * Publish restaurant approval response to Kafka
     * @param orderOutboxMessage Outbox message containing the event
     * @param outboxCallback Callback to update outbox status
     */
    async publish(orderOutboxMessage, outboxCallback) {
        const orderEventPayload = JSON.parse(orderOutboxMessage.getPayload());
        const sagaId = orderOutboxMessage.getSagaId();
        this.logger.info(`Received OrderOutboxMessage for order id: ${orderEventPayload.orderId} and saga id: ${sagaId}`);
        try {
            const restaurantApprovalResponseAvroModel = this.restaurantMessagingDataMapper.orderEventPayloadToRestaurantApprovalResponseAvroModel(sagaId, orderEventPayload);
            const topicName = this.restaurantServiceConfigData.restaurantApprovalResponseTopicName;
            await this.kafkaProducer.send(topicName, sagaId, restaurantApprovalResponseAvroModel, this.kafkaMessageHelper.getKafkaCallback(topicName, restaurantApprovalResponseAvroModel, orderOutboxMessage, outboxCallback, orderEventPayload.orderId, 'RestaurantApprovalResponseAvroModel'));
            this.logger.info(`RestaurantApprovalResponseAvroModel sent to kafka for order id: ${restaurantApprovalResponseAvroModel.orderId} and saga id: ${sagaId}`);
        }
        catch (error) {
            this.logger.error(`Error while sending RestaurantApprovalResponseAvroModel to kafka for order id: ${orderEventPayload.orderId} and saga id: ${sagaId}`, error);
            throw error;
        }
    }
}
exports.RestaurantApprovalEventKafkaPublisher = RestaurantApprovalEventKafkaPublisher;
