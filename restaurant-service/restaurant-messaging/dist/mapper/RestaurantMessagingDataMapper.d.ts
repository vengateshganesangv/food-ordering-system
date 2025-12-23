import { RestaurantApprovalRequest, OrderEventPayload } from '@food-ordering-system/restaurant-application-service';
export interface ProductAvroModel {
    id: string;
    quantity: number;
}
export interface RestaurantApprovalRequestAvroModel {
    id: string;
    sagaId: string;
    restaurantId: string;
    orderId: string;
    restaurantOrderStatus: string;
    products: ProductAvroModel[];
    price: number;
    createdAt: number;
}
export interface RestaurantApprovalResponseAvroModel {
    id: string;
    sagaId: string;
    restaurantId: string;
    orderId: string;
    createdAt: number;
    orderApprovalStatus: string;
    failureMessages: string[];
}
/**
 * Restaurant Messaging Data Mapper
 * Maps between Kafka Avro models and domain models
 */
export declare class RestaurantMessagingDataMapper {
    /**
     * Convert RestaurantApprovalRequestAvroModel to RestaurantApprovalRequest DTO
     * @param avroModel Avro model from Kafka
     * @returns Domain DTO for restaurant approval
     */
    restaurantApprovalRequestAvroModelToRestaurantApproval(avroModel: RestaurantApprovalRequestAvroModel): RestaurantApprovalRequest;
    /**
     * Convert OrderEventPayload to RestaurantApprovalResponseAvroModel
     * @param sagaId SAGA identifier
     * @param orderEventPayload Domain event payload
     * @returns Avro model for Kafka publishing
     */
    orderEventPayloadToRestaurantApprovalResponseAvroModel(sagaId: string, orderEventPayload: OrderEventPayload): RestaurantApprovalResponseAvroModel;
}
