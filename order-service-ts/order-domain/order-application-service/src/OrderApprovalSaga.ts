import { OrderStatus, SagaStatus, SagaStep } from '@food-ordering-system/common-domain';
import { OrderDomainService, Order, OrderCancelledEvent } from '@food-ordering-system/order-domain-core';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { RestaurantApprovalResponse } from './dto/message/RestaurantApprovalResponse';
import { OrderDataMapper } from './mapper/OrderDataMapper';
import { OrderApprovalOutboxMessage } from './outbox/model/approval/OrderApprovalOutboxMessage';
import { OrderPaymentOutboxMessage } from './outbox/model/payment/OrderPaymentOutboxMessage';
import { PaymentOutboxHelper } from './outbox/scheduler/payment/PaymentOutboxHelper';
import { ApprovalOutboxHelper } from './outbox/scheduler/approval/ApprovalOutboxHelper';
import { OrderSagaHelper } from './OrderSagaHelper';

/**
 * Order Approval Saga
 * Coordinates restaurant approval transactions in the order SAGA
 */
export class OrderApprovalSaga implements SagaStep<RestaurantApprovalResponse> {
  private static readonly logger = {
    info: (message: string, ...args: any[]) => console.log(`[OrderApprovalSaga] ${message}`, ...args),
    error: (message: string, ...args: any[]) => console.error(`[OrderApprovalSaga] ${message}`, ...args),
  };

  constructor(
    private readonly orderDomainService: OrderDomainService,
    private readonly orderSagaHelper: OrderSagaHelper,
    private readonly paymentOutboxHelper: PaymentOutboxHelper,
    private readonly approvalOutboxHelper: ApprovalOutboxHelper,
    private readonly orderDataMapper: OrderDataMapper,
  ) {}

  async process(restaurantApprovalResponse: RestaurantApprovalResponse): Promise<void> {
    const orderApprovalOutboxMessageResponse =
      await this.approvalOutboxHelper.getApprovalOutboxMessageBySagaIdAndSagaStatus(
        restaurantApprovalResponse.getSagaId(),
        SagaStatus.PROCESSING,
      );

    if (!orderApprovalOutboxMessageResponse) {
      OrderApprovalSaga.logger.info(
        `An outbox message with saga id: ${restaurantApprovalResponse.getSagaId()} is already processed!`,
      );
      return;
    }

    const orderApprovalOutboxMessage = orderApprovalOutboxMessageResponse;

    const order = await this.approveOrder(restaurantApprovalResponse);

    const sagaStatus = this.orderSagaHelper.orderStatusToSagaStatus(order.getOrderStatus());

    await this.approvalOutboxHelper.save(
      this.getUpdatedApprovalOutboxMessage(orderApprovalOutboxMessage, order.getOrderStatus(), sagaStatus),
    );

    await this.paymentOutboxHelper.save(
      await this.getUpdatedPaymentOutboxMessage(
        restaurantApprovalResponse.getSagaId(),
        order.getOrderStatus(),
        sagaStatus,
      ),
    );

    const orderId = order.getId();
    OrderApprovalSaga.logger.info(`Order with id: ${orderId ? orderId.getValue() : 'unknown'} is approved`);
  }

  async rollback(restaurantApprovalResponse: RestaurantApprovalResponse): Promise<void> {
    const orderApprovalOutboxMessageResponse =
      await this.approvalOutboxHelper.getApprovalOutboxMessageBySagaIdAndSagaStatus(
        restaurantApprovalResponse.getSagaId(),
        SagaStatus.PROCESSING,
      );

    if (!orderApprovalOutboxMessageResponse) {
      OrderApprovalSaga.logger.info(
        `An outbox message with saga id: ${restaurantApprovalResponse.getSagaId()} is already roll backed!`,
      );
      return;
    }

    const orderApprovalOutboxMessage = orderApprovalOutboxMessageResponse;

    const domainEvent = await this.rollbackOrder(restaurantApprovalResponse);

    const sagaStatus = this.orderSagaHelper.orderStatusToSagaStatus(domainEvent.getOrder().getOrderStatus());

    await this.approvalOutboxHelper.save(
      this.getUpdatedApprovalOutboxMessage(orderApprovalOutboxMessage, domainEvent.getOrder().getOrderStatus(), sagaStatus),
    );

    await this.paymentOutboxHelper.savePaymentOutboxMessage(
      this.orderDataMapper.orderCancelledEventToOrderPaymentEventPayload(domainEvent),
      domainEvent.getOrder().getOrderStatus(),
      sagaStatus,
      OutboxStatus.STARTED,
      restaurantApprovalResponse.getSagaId(),
    );

    const orderId = domainEvent.getOrder().getId();
    OrderApprovalSaga.logger.info(`Order with id: ${orderId ? orderId.getValue() : 'unknown'} is cancelling`);
  }

  private async approveOrder(restaurantApprovalResponse: RestaurantApprovalResponse): Promise<Order> {
    OrderApprovalSaga.logger.info(`Approving order with id: ${restaurantApprovalResponse.getOrderId()}`);
    const order = await this.orderSagaHelper.findOrder(restaurantApprovalResponse.getOrderId());
    this.orderDomainService.approveOrder(order);
    await this.orderSagaHelper.saveOrder(order);
    return order;
  }

  private getUpdatedApprovalOutboxMessage(
    orderApprovalOutboxMessage: OrderApprovalOutboxMessage,
    orderStatus: OrderStatus,
    sagaStatus: SagaStatus,
  ): OrderApprovalOutboxMessage {
    orderApprovalOutboxMessage.setProcessedAt(new Date());
    orderApprovalOutboxMessage.setOrderStatus(orderStatus);
    orderApprovalOutboxMessage.setSagaStatus(sagaStatus);
    return orderApprovalOutboxMessage;
  }

  private async getUpdatedPaymentOutboxMessage(
    sagaId: string,
    orderStatus: OrderStatus,
    sagaStatus: SagaStatus,
  ): Promise<OrderPaymentOutboxMessage> {
    const orderPaymentOutboxMessageResponse =
      await this.paymentOutboxHelper.getPaymentOutboxMessageBySagaIdAndSagaStatus(sagaId, SagaStatus.PROCESSING);
    if (!orderPaymentOutboxMessageResponse) {
      throw new Error(`Payment outbox message cannot be found in ${SagaStatus.PROCESSING} state`);
    }
    const orderPaymentOutboxMessage = orderPaymentOutboxMessageResponse;
    orderPaymentOutboxMessage.setProcessedAt(new Date());
    orderPaymentOutboxMessage.setOrderStatus(orderStatus);
    orderPaymentOutboxMessage.setSagaStatus(sagaStatus);
    return orderPaymentOutboxMessage;
  }

  private async rollbackOrder(restaurantApprovalResponse: RestaurantApprovalResponse): Promise<OrderCancelledEvent> {
    OrderApprovalSaga.logger.info(`Cancelling order with id: ${restaurantApprovalResponse.getOrderId()}`);
    const order = await this.orderSagaHelper.findOrder(restaurantApprovalResponse.getOrderId());
    const domainEvent = this.orderDomainService.cancelOrderPayment(order, restaurantApprovalResponse.getFailureMessages());
    await this.orderSagaHelper.saveOrder(order);
    return domainEvent;
  }
}
