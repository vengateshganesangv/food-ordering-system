import { injectable } from 'tsyringe';
import { RestaurantId, OrderId, OrderStatus, ProductId, Money, OrderApprovalStatus } from '@food-ordering-system/common-domain';
import { Restaurant, Product, OrderDetail, OrderApprovalEvent } from '@food-ordering-system/restaurant-domain-core';
import { RestaurantApprovalRequest } from '../dto/RestaurantApprovalRequest';
import { OrderEventPayload } from '../outbox/OrderEventPayload';

@injectable()
export class RestaurantDataMapper {
  restaurantApprovalRequestToRestaurant(request: RestaurantApprovalRequest): Restaurant {
    return Restaurant.builder()
      .setRestaurantId(new RestaurantId(request.restaurantId))
      .setOrderDetail(
        OrderDetail.builder()
          .setOrderId(new OrderId(request.orderId))
          .setProducts(
            request.products.map((product) =>
              Product.builder()
                .setProductId(new ProductId(product.getId()!.getValue()))
                .setQuantity(product.quantity)
                .build()
            )
          )
          .setTotalAmount(new Money(request.price))
          .setOrderStatus(this.stringToOrderStatus(request.restaurantOrderStatus.toString()))
          .build()
      )
      .build();
  }

  orderApprovalEventToOrderEventPayload(event: OrderApprovalEvent): OrderEventPayload {
    return new OrderEventPayload({
      orderId: event.orderApproval.orderId.getValue(),
      restaurantId: event.restaurantId.getValue(),
      orderApprovalStatus: event.orderApproval.approvalStatus.toString(),
      failureMessages: event.failureMessages,
      createdAt: event.createdAt,
    });
  }

  private stringToOrderStatus(status: string): OrderStatus {
    switch (status) {
      case 'PAID':
        return OrderStatus.PAID;
      default:
        return OrderStatus.PENDING;
    }
  }
}
