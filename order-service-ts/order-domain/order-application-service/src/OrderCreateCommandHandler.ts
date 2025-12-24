import { v4 as uuidv4 } from 'uuid';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { CreateOrderCommand } from './dto/create/CreateOrderCommand';
import { CreateOrderResponse } from './dto/create/CreateOrderResponse';
import { OrderCreateHelper } from './OrderCreateHelper';
import { OrderDataMapper } from './mapper/OrderDataMapper';
import { PaymentOutboxHelper } from './outbox/scheduler/payment/PaymentOutboxHelper';
import { OrderSagaHelper } from './OrderSagaHelper';

/**
 * Order Create Command Handler
 * Handles order creation commands
 */
export class OrderCreateCommandHandler {
  private static readonly logger = {
    info: (message: string, ...args: any[]) => console.log(`[OrderCreateCommandHandler] ${message}`, ...args),
  };

  constructor(
    private readonly orderCreateHelper: OrderCreateHelper,
    private readonly orderDataMapper: OrderDataMapper,
    private readonly paymentOutboxHelper: PaymentOutboxHelper,
    private readonly orderSagaHelper: OrderSagaHelper,
  ) {}

  async createOrder(createOrderCommand: CreateOrderCommand): Promise<CreateOrderResponse> {
    const orderCreatedEvent = await this.orderCreateHelper.persistOrder(createOrderCommand);
    const orderId = orderCreatedEvent.getOrder().getId();
    OrderCreateCommandHandler.logger.info(`Order is created with id: ${orderId ? orderId.getValue() : 'unknown'}`);

    const createOrderResponse = this.orderDataMapper.orderToCreateOrderResponse(
      orderCreatedEvent.getOrder(),
      'Order created successfully',
    );

    await this.paymentOutboxHelper.savePaymentOutboxMessage(
      this.orderDataMapper.orderCreatedEventToOrderPaymentEventPayload(orderCreatedEvent),
      orderCreatedEvent.getOrder().getOrderStatus(),
      this.orderSagaHelper.orderStatusToSagaStatus(orderCreatedEvent.getOrder().getOrderStatus()),
      OutboxStatus.STARTED,
      uuidv4(),
    );

    OrderCreateCommandHandler.logger.info(`Returning CreateOrderResponse with order id: ${orderId ? orderId.getValue() : 'unknown'}`);

    return createOrderResponse;
  }
}
