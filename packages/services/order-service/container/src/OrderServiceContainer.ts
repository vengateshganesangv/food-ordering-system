import 'reflect-metadata';
import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { OrderDomainService, OrderDomainServiceImpl } from '@food-ordering-system/order-domain-core';
import {
  OrderApplicationService,
  OrderApplicationServiceImpl,
  OrderCreateCommandHandler,
  OrderTrackCommandHandler,
  OrderCreateHelper,
  OrderSagaHelper,
  OrderPaymentSaga,
  OrderApprovalSaga,
  PaymentResponseMessageListenerImpl,
  RestaurantApprovalResponseMessageListenerImpl,
  CustomerMessageListenerImpl,
  OrderDataMapper,
  PaymentOutboxHelper,
  ApprovalOutboxHelper,
} from '@food-ordering-system/order-application-service';

export class OrderServiceContainer {
  static async initialize(dataSource: DataSource): Promise<void> {
    // Register Domain Service
    container.register<OrderDomainService>('OrderDomainService', {
      useClass: OrderDomainServiceImpl,
    });

    // Register Application Service
    container.register<OrderApplicationService>('OrderApplicationService', {
      useClass: OrderApplicationServiceImpl,
    });

    // Register Data Source
    container.registerInstance(DataSource, dataSource);

    // Register all other services and handlers
    container.register(OrderCreateCommandHandler, { useClass: OrderCreateCommandHandler });
    container.register(OrderTrackCommandHandler, { useClass: OrderTrackCommandHandler });
    container.register(OrderCreateHelper, { useClass: OrderCreateHelper });
    container.register(OrderSagaHelper, { useClass: OrderSagaHelper });
    container.register(OrderPaymentSaga, { useClass: OrderPaymentSaga });
    container.register(OrderApprovalSaga, { useClass: OrderApprovalSaga });
    container.register(PaymentResponseMessageListenerImpl, { useClass: PaymentResponseMessageListenerImpl });
    container.register(RestaurantApprovalResponseMessageListenerImpl, { useClass: RestaurantApprovalResponseMessageListenerImpl });
    container.register(CustomerMessageListenerImpl, { useClass: CustomerMessageListenerImpl });
    container.register(OrderDataMapper, { useClass: OrderDataMapper });
    container.register(PaymentOutboxHelper, { useClass: PaymentOutboxHelper });
    container.register(ApprovalOutboxHelper, { useClass: ApprovalOutboxHelper });

    console.log('Order Service Container initialized successfully');
  }
}
