import { injectable } from 'tsyringe';
import { OrderApprovalStatus, OrderStatus } from '@food-ordering-system/common-domain';
import { Order, OrderDomainService } from '@food-ordering-system/order-domain-core';
import { SagaStep, SagaStatus } from '@food-ordering-system/saga';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { RestaurantApprovalResponse } from './dto/message/RestaurantApprovalResponse';
import { OrderApprovalOutboxMessage } from './outbox/model/approval/OrderApprovalOutboxMessage';
import { ApprovalOutboxHelper } from './outbox/scheduler/approval/ApprovalOutboxHelper';
import { PaymentOutboxHelper } from './outbox/scheduler/payment/PaymentOutboxHelper';
import { OrderSagaHelper } from './OrderSagaHelper';
import { OrderDataMapper } from './mapper/OrderDataMapper';

@injectable()
export class OrderApprovalSaga implements SagaStep<RestaurantApprovalResponse> {
  constructor(
    private orderDomainService: OrderDomainService,
    private approvalOutboxHelper: ApprovalOutboxHelper,
    private paymentOutboxHelper: PaymentOutboxHelper,
    private orderSagaHelper: OrderSagaHelper,
    private orderDataMapper: OrderDataMapper
  ) {}

  async process(restaurantApprovalResponse: RestaurantApprovalResponse): Promise<void> {
    const orderApprovalOutboxMessage = await this.approvalOutboxHelper.getApprovalOutboxMessageBySagaIdAndSagaStatus(
      restaurantApprovalResponse.sagaId,
      SagaStatus.PROCESSING
    );

    if (!orderApprovalOutboxMessage) {
      console.log('An outbox message with saga id:', restaurantApprovalResponse.sagaId, 'is already processed!');
      return;
    }

    const order = await this.approveOrder(restaurantApprovalResponse);
    const sagaStatus = this.orderSagaHelper.orderStatusToSagaStatus(order.orderStatus!);

    orderApprovalOutboxMessage.setProcessedAt(new Date());
    orderApprovalOutboxMessage.setOrderStatus(order.orderStatus!);
    orderApprovalOutboxMessage.setSagaStatus(sagaStatus);
    await this.approvalOutboxHelper.save(orderApprovalOutboxMessage);

    console.log('Order with id:', order.getId()!.getValue(), 'is approved');
  }

  async rollback(restaurantApprovalResponse: RestaurantApprovalResponse): Promise<void> {
    const orderApprovalOutboxMessage = await this.approvalOutboxHelper.getApprovalOutboxMessageBySagaIdAndSagaStatus(
      restaurantApprovalResponse.sagaId,
      SagaStatus.PROCESSING
    );

    if (!orderApprovalOutboxMessage) {
      console.log('An outbox message with saga id:', restaurantApprovalResponse.sagaId, 'is already roll backed!');
      return;
    }

    const order = await this.rollbackOrder(restaurantApprovalResponse);
    const sagaStatus = this.orderSagaHelper.orderStatusToSagaStatus(order.orderStatus!);

    orderApprovalOutboxMessage.setProcessedAt(new Date());
    orderApprovalOutboxMessage.setOrderStatus(order.orderStatus!);
    orderApprovalOutboxMessage.setSagaStatus(sagaStatus);
    await this.approvalOutboxHelper.save(orderApprovalOutboxMessage);

    await this.paymentOutboxHelper.savePaymentOutboxMessage(
      this.orderDataMapper.orderCancelledEventToOrderPaymentEventPayload(
        this.orderDomainService.cancelOrderPayment(order, restaurantApprovalResponse.failureMessages)
      ),
      order.orderStatus!,
      sagaStatus,
      OutboxStatus.STARTED,
      restaurantApprovalResponse.sagaId
    );

    console.log('Order with id:', order.getId()!.getValue(), 'is cancelling');
  }

  private async approveOrder(restaurantApprovalResponse: RestaurantApprovalResponse): Promise<Order> {
    console.log('Approving order with id:', restaurantApprovalResponse.orderId);
    const order = await this.orderSagaHelper.findOrder(restaurantApprovalResponse.orderId);
    this.orderDomainService.approveOrder(order);
    await this.orderSagaHelper.saveOrder(order);
    return order;
  }

  private async rollbackOrder(restaurantApprovalResponse: RestaurantApprovalResponse): Promise<Order> {
    console.log('Cancelling order with id:', restaurantApprovalResponse.orderId);
    const order = await this.orderSagaHelper.findOrder(restaurantApprovalResponse.orderId);
    this.orderDomainService.cancelOrder(order, restaurantApprovalResponse.failureMessages);
    await this.orderSagaHelper.saveOrder(order);
    return order;
  }
}
