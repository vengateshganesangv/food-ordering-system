"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantMessagingDataMapper = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
const restaurant_application_service_1 = require("@food-ordering-system/restaurant-application-service");
const restaurant_domain_core_1 = require("@food-ordering-system/restaurant-domain-core");
const uuid_1 = require("uuid");
/**
 * Restaurant Messaging Data Mapper
 * Maps between Kafka Avro models and domain models
 */
class RestaurantMessagingDataMapper {
    /**
     * Convert RestaurantApprovalRequestAvroModel to RestaurantApprovalRequest DTO
     * @param avroModel Avro model from Kafka
     * @returns Domain DTO for restaurant approval
     */
    restaurantApprovalRequestAvroModelToRestaurantApproval(avroModel) {
        return new restaurant_application_service_1.RestaurantApprovalRequestBuilder()
            .id(avroModel.id)
            .sagaId(avroModel.sagaId)
            .restaurantId(avroModel.restaurantId)
            .orderId(avroModel.orderId)
            .restaurantOrderStatus(common_domain_1.RestaurantOrderStatus[avroModel.restaurantOrderStatus])
            .products(avroModel.products.map((avroProduct) => restaurant_domain_core_1.Product.builder()
            .productId(new common_domain_1.ProductId(avroProduct.id))
            .quantity(avroProduct.quantity)
            .build()))
            .price(avroModel.price)
            .createdAt(new Date(avroModel.createdAt))
            .build();
    }
    /**
     * Convert OrderEventPayload to RestaurantApprovalResponseAvroModel
     * @param sagaId SAGA identifier
     * @param orderEventPayload Domain event payload
     * @returns Avro model for Kafka publishing
     */
    orderEventPayloadToRestaurantApprovalResponseAvroModel(sagaId, orderEventPayload) {
        return {
            id: (0, uuid_1.v4)(),
            sagaId,
            orderId: orderEventPayload.orderId,
            restaurantId: orderEventPayload.restaurantId,
            createdAt: orderEventPayload.createdAt.getTime(),
            orderApprovalStatus: orderEventPayload.orderApprovalStatus,
            failureMessages: orderEventPayload.failureMessages,
        };
    }
}
exports.RestaurantMessagingDataMapper = RestaurantMessagingDataMapper;
