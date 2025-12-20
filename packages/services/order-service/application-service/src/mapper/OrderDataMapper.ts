import { injectable } from 'tsyringe';
import {
  CustomerId,
  RestaurantId,
  ProductId,
  Money,
  OrderId,
  PaymentOrderStatus,
  RestaurantOrderStatus,
} from '@food-ordering-system/common-domain';
import {
  Order,
  Restaurant,
  Product,
  OrderItem,
  StreetAddress,
  TrackingId,
  Customer,
  OrderCreatedEvent,
  OrderPaidEvent,
  OrderCancelledEvent,
} from '@food-ordering-system/order-domain-core';
import { CreateOrderCommand } from '../dto/create/CreateOrderCommand';
import { CreateOrderResponse } from '../dto/create/CreateOrderResponse';
import { TrackOrderResponse } from '../dto/track/TrackOrderResponse';
import { OrderPaymentEventPayload } from '../outbox/model/payment/OrderPaymentEventPayload';
import { OrderApprovalEventPayload } from '../outbox/model/approval/OrderApprovalEventPayload';
import { OrderApprovalEventProduct } from '../outbox/model/approval/OrderApprovalEventProduct';
import { CustomerModel } from '../dto/message/CustomerModel';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class OrderDataMapper {
  createOrderCommandToRestaurant(createOrderCommand: CreateOrderCommand): Restaurant {
    return Restaurant.builder()
      .setRestaurantId(new RestaurantId(createOrderCommand.restaurantId))
      .setProducts(
        createOrderCommand.items.map(
          (orderItem) => new Product(new ProductId(orderItem.productId))
        )
      )
      .build();
  }

  createOrderCommandToOrder(createOrderCommand: CreateOrderCommand): Order {
    return Order.builder()
      .setCustomerId(new CustomerId(createOrderCommand.customerId))
      .setRestaurantId(new RestaurantId(createOrderCommand.restaurantId))
      .setDeliveryAddress(
        this.orderAddressToStreetAddress(createOrderCommand.address)
      )
      .setPrice(new Money(createOrderCommand.price))
      .setItems(this.orderItemsToOrderItemEntities(createOrderCommand.items))
      .build();
  }

  orderToCreateOrderResponse(order: Order, message: string): CreateOrderResponse {
    return new CreateOrderResponse(
      order.trackingId!.getValue(),
      order.orderStatus!,
      message
    );
  }

  orderToTrackOrderResponse(order: Order): TrackOrderResponse {
    return new TrackOrderResponse(
      order.trackingId!.getValue(),
      order.orderStatus!,
      order.failureMessages
    );
  }

  orderCreatedEventToOrderPaymentEventPayload(
    orderCreatedEvent: OrderCreatedEvent
  ): OrderPaymentEventPayload {
    return new OrderPaymentEventPayload(
      orderCreatedEvent.order.getId()!.getValue(),
      orderCreatedEvent.order.customerId.getValue(),
      orderCreatedEvent.order.price.getAmount(),
      orderCreatedEvent.createdAt,
      PaymentOrderStatus.PENDING
    );
  }

  orderCancelledEventToOrderPaymentEventPayload(
    orderCancelledEvent: OrderCancelledEvent
  ): OrderPaymentEventPayload {
    return new OrderPaymentEventPayload(
      orderCancelledEvent.order.getId()!.getValue(),
      orderCancelledEvent.order.customerId.getValue(),
      orderCancelledEvent.order.price.getAmount(),
      orderCancelledEvent.createdAt,
      PaymentOrderStatus.CANCELLED
    );
  }

  orderPaidEventToOrderApprovalEventPayload(
    orderPaidEvent: OrderPaidEvent
  ): OrderApprovalEventPayload {
    return new OrderApprovalEventPayload(
      orderPaidEvent.order.getId()!.getValue(),
      orderPaidEvent.order.restaurantId.getValue(),
      orderPaidEvent.order.price.getAmount(),
      orderPaidEvent.createdAt,
      RestaurantOrderStatus.PAID,
      orderPaidEvent.order.items.map(
        (orderItem) =>
          new OrderApprovalEventProduct(
            orderItem.product.getId()!.getValue(),
            orderItem.quantity
          )
      )
    );
  }

  customerModelToCustomer(customerModel: CustomerModel): Customer {
    return new Customer(
      new CustomerId(customerModel.id),
      customerModel.username,
      customerModel.firstName,
      customerModel.lastName
    );
  }

  private orderItemsToOrderItemEntities(
    orderItems: import('../dto/create/OrderItem').OrderItemDto[]
  ): OrderItem[] {
    return orderItems.map((orderItem) =>
      OrderItem.builder()
        .setProduct(new Product(new ProductId(orderItem.productId)))
        .setPrice(new Money(orderItem.price))
        .setQuantity(orderItem.quantity)
        .setSubTotal(new Money(orderItem.subTotal))
        .build()
    );
  }

  private orderAddressToStreetAddress(
    orderAddress: import('../dto/create/OrderAddress').OrderAddressDto
  ): StreetAddress {
    return new StreetAddress(
      uuidv4(),
      orderAddress.street,
      orderAddress.postalCode,
      orderAddress.city
    );
  }
}
