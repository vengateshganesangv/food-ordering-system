import { ProductId, RestaurantOrderStatus } from '@food-ordering-system/common-domain';
import {
  RestaurantApprovalRequest,
  RestaurantApprovalRequestBuilder,
  OrderEventPayload,
} from '@food-ordering-system/restaurant-application-service';
import { Product } from '@food-ordering-system/restaurant-domain-core';
import { v4 as uuidv4 } from 'uuid';

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
export class RestaurantMessagingDataMapper {
  /**
   * Convert RestaurantApprovalRequestAvroModel to RestaurantApprovalRequest DTO
   * @param avroModel Avro model from Kafka
   * @returns Domain DTO for restaurant approval
   */
  restaurantApprovalRequestAvroModelToRestaurantApproval(
    avroModel: RestaurantApprovalRequestAvroModel,
  ): RestaurantApprovalRequest {
    return new RestaurantApprovalRequestBuilder()
      .id(avroModel.id)
      .sagaId(avroModel.sagaId)
      .restaurantId(avroModel.restaurantId)
      .orderId(avroModel.orderId)
      .restaurantOrderStatus(RestaurantOrderStatus[avroModel.restaurantOrderStatus as keyof typeof RestaurantOrderStatus])
      .products(
        avroModel.products.map((avroProduct: ProductAvroModel) =>
          Product.builder()
            .productId(new ProductId(avroProduct.id))
            .quantity(avroProduct.quantity)
            .build(),
        ),
      )
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
  orderEventPayloadToRestaurantApprovalResponseAvroModel(
    sagaId: string,
    orderEventPayload: OrderEventPayload,
  ): RestaurantApprovalResponseAvroModel {
    return {
      id: uuidv4(),
      sagaId,
      orderId: orderEventPayload.orderId,
      restaurantId: orderEventPayload.restaurantId,
      createdAt: orderEventPayload.createdAt.getTime(),
      orderApprovalStatus: orderEventPayload.orderApprovalStatus,
      failureMessages: orderEventPayload.failureMessages,
    };
  }
}
