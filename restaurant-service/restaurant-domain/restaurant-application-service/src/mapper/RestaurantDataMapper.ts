import { Money, OrderId, OrderStatus, RestaurantId } from '@food-ordering-system/common-domain';
import { RestaurantApprovalRequest } from '../dto/RestaurantApprovalRequest';
import { OrderDetail } from '../../../restaurant-domain-core/src/entity/OrderDetail';
import { Product } from '../../../restaurant-domain-core/src/entity/Product';
import { Restaurant } from '../../../restaurant-domain-core/src/entity/Restaurant';
import { OrderApprovalEvent } from '../../../restaurant-domain-core/src/event/OrderApprovalEvent';
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
      new Product.Builder()
        .productId(product.getId())
        .quantity(product.getQuantity())
        .build(),
    );

    const orderDetail = new OrderDetail.Builder()
      .orderId(new OrderId(restaurantApprovalRequest.orderId))
      .products(products)
      .totalAmount(new Money(restaurantApprovalRequest.price))
      .orderStatus(OrderStatus[restaurantApprovalRequest.restaurantOrderStatus as keyof typeof OrderStatus])
      .build();

    return new Restaurant.Builder()
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
