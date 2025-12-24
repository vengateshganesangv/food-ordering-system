import { v4 as uuidv4 } from 'uuid';
import {
  CustomerId,
  Money,
  ProductId,
  RestaurantId,
  PaymentOrderStatus,
  RestaurantOrderStatus,
} from '@food-ordering-system/common-domain';
import {
  Order,
  Restaurant,
  Product,
  OrderItem as DomainOrderItem,
  Customer,
  StreetAddress,
  OrderCreatedEvent,
  OrderPaidEvent,
  OrderCancelledEvent,
} from '@food-ordering-system/order-domain-core';
import { CreateOrderCommand } from '../dto/create/CreateOrderCommand';
import { CreateOrderResponse } from '../dto/create/CreateOrderResponse';
import { OrderAddress } from '../dto/create/OrderAddress';
import { OrderItem as DTOOrderItem } from '../dto/create/OrderItem';
import { TrackOrderResponse } from '../dto/track/TrackOrderResponse';
import { CustomerModel } from '../dto/message/CustomerModel';
import { OrderPaymentEventPayload } from '../outbox/model/payment/OrderPaymentEventPayload';
import { OrderApprovalEventPayload } from '../outbox/model/approval/OrderApprovalEventPayload';
import { OrderApprovalEventProduct } from '../outbox/model/approval/OrderApprovalEventProduct';

/**
 * Order Data Mapper
 * Maps between DTOs and domain entities
 */
export class OrderDataMapper {
  createOrderCommandToRestaurant(createOrderCommand: CreateOrderCommand): Restaurant {
    return Restaurant.builder()
      .restaurantId(new RestaurantId(createOrderCommand.getRestaurantId()))
      .products(
        createOrderCommand.getItems().map((orderItem) => new Product(new ProductId(orderItem.getProductId()))),
      )
      .build();
  }

  createOrderCommandToOrder(createOrderCommand: CreateOrderCommand): Order {
    return Order.builder()
      .customerId(new CustomerId(createOrderCommand.getCustomerId()))
      .restaurantId(new RestaurantId(createOrderCommand.getRestaurantId()))
      .deliveryAddress(this.orderAddressToStreetAddress(createOrderCommand.getAddress()))
      .price(new Money(createOrderCommand.getPrice()))
      .items(this.orderItemsToOrderItemEntities(createOrderCommand.getItems()))
      .build();
  }

  orderToCreateOrderResponse(order: Order, message: string): CreateOrderResponse {
    const trackingId = order.getTrackingId();
    if (!trackingId) {
      throw new Error('Order tracking ID is not set');
    }
    return CreateOrderResponse.builder()
      .orderTrackingId(trackingId.getValue())
      .orderStatus(order.getOrderStatus())
      .message(message)
      .build();
  }

  orderToTrackOrderResponse(order: Order): TrackOrderResponse {
    const trackingId = order.getTrackingId();
    if (!trackingId) {
      throw new Error('Order tracking ID is not set');
    }
    return TrackOrderResponse.builder()
      .orderTrackingId(trackingId.getValue())
      .orderStatus(order.getOrderStatus())
      .failureMessages(order.getFailureMessages())
      .build();
  }

  orderCreatedEventToOrderPaymentEventPayload(orderCreatedEvent: OrderCreatedEvent): OrderPaymentEventPayload {
    const order = orderCreatedEvent.getOrder();
    const orderId = order.getId();
    const customerId = order.getCustomerId();

    if (!orderId) {
      throw new Error('Order ID is not set');
    }

    return OrderPaymentEventPayload.builder()
      .customerId(customerId.getValue())
      .orderId(orderId.getValue())
      .price(order.getPrice().getAmount())
      .createdAt(orderCreatedEvent.getCreatedAt())
      .paymentOrderStatus(PaymentOrderStatus.PENDING)
      .build();
  }

  orderCancelledEventToOrderPaymentEventPayload(orderCancelledEvent: OrderCancelledEvent): OrderPaymentEventPayload {
    const order = orderCancelledEvent.getOrder();
    const orderId = order.getId();
    const customerId = order.getCustomerId();

    if (!orderId) {
      throw new Error('Order ID is not set');
    }

    return OrderPaymentEventPayload.builder()
      .customerId(customerId.getValue())
      .orderId(orderId.getValue())
      .price(order.getPrice().getAmount())
      .createdAt(orderCancelledEvent.getCreatedAt())
      .paymentOrderStatus(PaymentOrderStatus.CANCELLED)
      .build();
  }

  orderPaidEventToOrderApprovalEventPayload(orderPaidEvent: OrderPaidEvent): OrderApprovalEventPayload {
    const order = orderPaidEvent.getOrder();
    const orderId = order.getId();
    const restaurantId = order.getRestaurantId();

    if (!orderId) {
      throw new Error('Order ID is not set');
    }

    return OrderApprovalEventPayload.builder()
      .orderId(orderId.getValue())
      .restaurantId(restaurantId.getValue())
      .restaurantOrderStatus(RestaurantOrderStatus.PAID)
      .products(
        order.getItems().map((orderItem) => {
          const productId = orderItem.getProduct().getId();
          if (!productId) {
            throw new Error('Product ID is not set');
          }
          return OrderApprovalEventProduct.builder()
            .id(productId.getValue())
            .quantity(orderItem.getQuantity())
            .build();
        }),
      )
      .price(order.getPrice().getAmount())
      .createdAt(orderPaidEvent.getCreatedAt())
      .build();
  }

  customerModelToCustomer(customerModel: CustomerModel): Customer {
    return new Customer(
      new CustomerId(customerModel.getId()),
      customerModel.getUsername(),
      customerModel.getFirstName(),
      customerModel.getLastName(),
    );
  }

  private orderItemsToOrderItemEntities(orderItems: DTOOrderItem[]): DomainOrderItem[] {
    return orderItems.map((orderItem) =>
      DomainOrderItem.builder()
        .product(new Product(new ProductId(orderItem.getProductId())))
        .price(new Money(orderItem.getPrice()))
        .quantity(orderItem.getQuantity())
        .subTotal(new Money(orderItem.getSubTotal()))
        .build(),
    );
  }

  private orderAddressToStreetAddress(orderAddress: OrderAddress): StreetAddress {
    return new StreetAddress(
      uuidv4(),
      orderAddress.getStreet(),
      orderAddress.getPostalCode(),
      orderAddress.getCity(),
    );
  }
}
