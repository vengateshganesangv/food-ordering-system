import {
  CustomerId,
  Money,
  OrderId,
  ProductId,
  RestaurantId,
} from '@food-ordering-system/common-domain';
import {
  Order,
  OrderItem,
  Product,
  OrderItemId,
  StreetAddress,
  TrackingId,
} from '@food-ordering-system/order-domain-core';
import { OrderEntity } from '../entity/OrderEntity';
import { OrderItemEntity } from '../entity/OrderItemEntity';
import { OrderAddressEntity } from '../entity/OrderAddressEntity';

const FAILURE_MESSAGE_DELIMITER = ',';

export class OrderDataAccessMapper {
  orderToOrderEntity(order: Order): OrderEntity {
    const orderEntity = new OrderEntity();
    const orderId = order.getId();
    const trackingId = order.getTrackingId();

    if (!orderId || !trackingId) {
      throw new Error('Order ID and Tracking ID must be set');
    }

    orderEntity.id = orderId.getValue();
    orderEntity.customerId = order.getCustomerId().getValue();
    orderEntity.restaurantId = order.getRestaurantId().getValue();
    orderEntity.trackingId = trackingId.getValue();
    orderEntity.price = order.getPrice().getAmount();
    orderEntity.orderStatus = order.getOrderStatus();
    orderEntity.failureMessages = order.getFailureMessages()
      ? order.getFailureMessages().join(FAILURE_MESSAGE_DELIMITER)
      : '';

    const addressEntity = this.deliveryAddressToAddressEntity(order.getDeliveryAddress());
    addressEntity.order = orderEntity;
    orderEntity.address = addressEntity;

    const itemEntities = this.orderItemsToOrderItemEntities(order.getItems());
    itemEntities.forEach((itemEntity) => {
      itemEntity.order = orderEntity;
      itemEntity.orderId = orderEntity.id;
    });
    orderEntity.items = itemEntities;

    return orderEntity;
  }

  orderEntityToOrder(orderEntity: OrderEntity): Order {
    return Order.builder()
      .orderId(new OrderId(orderEntity.id))
      .customerId(new CustomerId(orderEntity.customerId))
      .restaurantId(new RestaurantId(orderEntity.restaurantId))
      .deliveryAddress(this.addressEntityToDeliveryAddress(orderEntity.address!))
      .price(new Money(orderEntity.price))
      .items(this.orderItemEntitiesToOrderItems(orderEntity.items || []))
      .trackingId(new TrackingId(orderEntity.trackingId))
      .orderStatus(orderEntity.orderStatus)
      .failureMessages(
        orderEntity.failureMessages && orderEntity.failureMessages.length > 0
          ? orderEntity.failureMessages.split(FAILURE_MESSAGE_DELIMITER)
          : [],
      )
      .build();
  }

  private orderItemEntitiesToOrderItems(items: OrderItemEntity[]): OrderItem[] {
    return items.map((orderItemEntity) =>
      OrderItem.builder()
        .orderItemId(new OrderItemId(orderItemEntity.id))
        .product(new Product(new ProductId(orderItemEntity.productId)))
        .price(new Money(orderItemEntity.price))
        .quantity(orderItemEntity.quantity)
        .subTotal(new Money(orderItemEntity.subTotal))
        .build(),
    );
  }

  private addressEntityToDeliveryAddress(address: OrderAddressEntity): StreetAddress {
    return new StreetAddress(address.id, address.street, address.postalCode, address.city);
  }

  private orderItemsToOrderItemEntities(items: OrderItem[]): OrderItemEntity[] {
    return items.map((orderItem) => {
      const entity = new OrderItemEntity();
      const orderItemId = orderItem.getId();
      const productId = orderItem.getProduct().getId();

      if (!orderItemId || !productId) {
        throw new Error('OrderItem ID and Product ID must be set');
      }

      entity.id = orderItemId.getValue();
      entity.productId = productId.getValue();
      entity.price = orderItem.getPrice().getAmount();
      entity.quantity = orderItem.getQuantity();
      entity.subTotal = orderItem.getSubTotal().getAmount();
      return entity;
    });
  }

  private deliveryAddressToAddressEntity(deliveryAddress: StreetAddress): OrderAddressEntity {
    const entity = new OrderAddressEntity();
    entity.id = deliveryAddress.getId();
    entity.street = deliveryAddress.getStreet();
    entity.postalCode = deliveryAddress.getPostalCode();
    entity.city = deliveryAddress.getCity();
    return entity;
  }
}
