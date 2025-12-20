import { injectable, inject } from 'tsyringe';
import { CreateOrderCommand } from './dto/create/CreateOrderCommand';
import { CreateOrderResponse } from './dto/create/CreateOrderResponse';
import { OrderCreateHelper } from './OrderCreateHelper';
import { OrderDataMapper } from './mapper/OrderDataMapper';
import { PaymentOutboxHelper } from './outbox/scheduler/payment/PaymentOutboxHelper';
import { OrderSagaHelper } from './OrderSagaHelper';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class OrderCreateCommandHandler {
  constructor(
    private orderCreateHelper: OrderCreateHelper,
    private orderDataMapper: OrderDataMapper,
    private paymentOutboxHelper: PaymentOutboxHelper,
    private orderSagaHelper: OrderSagaHelper
  ) {}

  async createOrder(createOrderCommand: CreateOrderCommand): Promise<CreateOrderResponse> {
    const orderCreatedEvent = await this.orderCreateHelper.persistOrder(createOrderCommand);
    const orderId = orderCreatedEvent.order.getId();
    console.log('Order is created with id:', orderId ? orderId.getValue() : 'unknown');

    const createOrderResponse = this.orderDataMapper.orderToCreateOrderResponse(
      orderCreatedEvent.order,
      'Order created successfully'
    );

    await this.paymentOutboxHelper.savePaymentOutboxMessage(
      this.orderDataMapper.orderCreatedEventToOrderPaymentEventPayload(orderCreatedEvent),
      orderCreatedEvent.order.orderStatus!,
      this.orderSagaHelper.orderStatusToSagaStatus(orderCreatedEvent.order.orderStatus!),
      OutboxStatus.STARTED,
      uuidv4()
    );

    console.log('Returning CreateOrderResponse with order id:', orderId ? orderId.getValue() : 'unknown');
    return createOrderResponse;
  }
}
