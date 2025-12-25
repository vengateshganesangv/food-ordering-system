import { Money, OrderId, OrderStatus, RestaurantId } from '@food-ordering-system/common-domain';
import { RestaurantApprovalRequest } from '../dto/RestaurantApprovalRequest';
import { OrderDetail } from '@food-ordering-system/restaurant-domain-core';
import { Product } from '@food-ordering-system/restaurant-domain-core';
import { Restaurant } from '@food-ordering-system/restaurant-domain-core';
import { OrderApprovalEvent } from '@food-ordering-system/restaurant-domain-core';
import { OrderEventPayload, OrderEventPayloadBuilder } from '../outbox/model/OrderEventPayload';

/**
 * Restaurant Data Mapper
 * Maps between DTOs, domain entities, and outbox messages
 */
export class RestaurantDataMapper {
  /**
   * Convert RestaurantApprovalRequest DTO to Restaurant domain entity
   */
  restaurantApprovalRequestToRestaurant(
    restaurantApprovalRequest: RestaurantApprovalRequest,
  ): Restaurant {
    const products = restaurantApprovalRequest.products.map((product) =>
      Product.builder()
        .productId(product.getId()!)
        .quantity(product.getQuantity())
        .build(),
    );

    const orderDetail = OrderDetail.builder()
      .orderId(new OrderId(restaurantApprovalRequest.orderId))
      .products(products)
      .totalAmount(new Money(restaurantApprovalRequest.price))
      .orderStatus(OrderStatus[restaurantApprovalRequest.restaurantOrderStatus as keyof typeof OrderStatus])
      .build();

    return Restaurant.builder()
      .restaurantId(new RestaurantId(restaurantApprovalRequest.restaurantId))
      .orderDetail(orderDetail)
      .build();
  }

  /**
   * Convert OrderApprovalEvent to OrderEventPayload for outbox
   */
  orderApprovalEventToOrderEventPayload(orderApprovalEvent: OrderApprovalEvent): OrderEventPayload {
    return new OrderEventPayloadBuilder()
      .orderId(orderApprovalEvent.getOrderApproval().getOrderId().getValue())
      .restaurantId(orderApprovalEvent.getRestaurantId().getValue())
      .orderApprovalStatus(orderApprovalEvent.getOrderApproval().getApprovalStatus())
      .createdAt(orderApprovalEvent.getCreatedAt())
      .failureMessages(orderApprovalEvent.getFailureMessages())
      .build();
  }
}
