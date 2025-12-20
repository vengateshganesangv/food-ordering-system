import { injectable } from 'tsyringe';
import { OrderId, OrderStatus, PaymentStatus } from '@food-ordering-system/common-domain';
import { Order, OrderDomainService, OrderPaidEvent, OrderNotFoundException } from '@food-ordering-system/order-domain-core';
import { SagaStep, SagaStatus } from '@food-ordering-system/saga';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { PaymentResponse } from './dto/message/PaymentResponse';
import { OrderPaymentOutboxMessage } from './outbox/model/payment/OrderPaymentOutboxMessage';
import { OrderApprovalOutboxMessage } from './outbox/model/approval/OrderApprovalOutboxMessage';
import { PaymentOutboxHelper } from './outbox/scheduler/payment/PaymentOutboxHelper';
import { ApprovalOutboxHelper } from './outbox/scheduler/approval/ApprovalOutboxHelper';
import { OrderSagaHelper } from './OrderSagaHelper';
import { OrderDataMapper } from './mapper/OrderDataMapper';

@injectable()
export class OrderPaymentSaga implements SagaStep<PaymentResponse> {
  constructor(
    private orderDomainService: OrderDomainService,
    private paymentOutboxHelper: PaymentOutboxHelper,
    private approvalOutboxHelper: ApprovalOutboxHelper,
    private orderSagaHelper: OrderSagaHelper,
    private orderDataMapper: OrderDataMapper
  ) {}

  async process(paymentResponse: PaymentResponse): Promise<void> {
    const orderPaymentOutboxMessage = await this.paymentOutboxHelper.getPaymentOutboxMessageBySagaIdAndSagaStatus(
      paymentResponse.sagaId,
      SagaStatus.STARTED
    );

    if (!orderPaymentOutboxMessage) {
      console.log('An outbox message with saga id:', paymentResponse.sagaId, 'is already processed!');
      return;
    }

    const domainEvent = await this.completePaymentForOrder(paymentResponse);
    const sagaStatus = this.orderSagaHelper.orderStatusToSagaStatus(domainEvent.order.orderStatus!);

    orderPaymentOutboxMessage.setProcessedAt(new Date());
    orderPaymentOutboxMessage.setOrderStatus(domainEvent.order.orderStatus!);
    orderPaymentOutboxMessage.setSagaStatus(sagaStatus);
    await this.paymentOutboxHelper.save(orderPaymentOutboxMessage);

    await this.approvalOutboxHelper.saveApprovalOutboxMessage(
      this.orderDataMapper.orderPaidEventToOrderApprovalEventPayload(domainEvent),
      domainEvent.order.orderStatus!,
      sagaStatus,
      OutboxStatus.STARTED,
      paymentResponse.sagaId
    );

    console.log('Order with id:', domainEvent.order.getId()!.getValue(), 'is paid');
  }

  async rollback(paymentResponse: PaymentResponse): Promise<void> {
    const currentSagaStatus = this.getCurrentSagaStatus(paymentResponse.paymentStatus);
    const orderPaymentOutboxMessage = await this.paymentOutboxHelper.getPaymentOutboxMessageBySagaIdAndSagaStatus(
      paymentResponse.sagaId,
      ...currentSagaStatus
    );

    if (!orderPaymentOutboxMessage) {
      console.log('An outbox message with saga id:', paymentResponse.sagaId, 'is already roll backed!');
      return;
    }

    const order = await this.rollbackPaymentForOrder(paymentResponse);
    const sagaStatus = this.orderSagaHelper.orderStatusToSagaStatus(order.orderStatus!);

    orderPaymentOutboxMessage.setProcessedAt(new Date());
    orderPaymentOutboxMessage.setOrderStatus(order.orderStatus!);
    orderPaymentOutboxMessage.setSagaStatus(sagaStatus);
    await this.paymentOutboxHelper.save(orderPaymentOutboxMessage);

    if (paymentResponse.paymentStatus === PaymentStatus.CANCELLED) {
      const approvalOutboxMessage = await this.approvalOutboxHelper.getApprovalOutboxMessageBySagaIdAndSagaStatus(
        paymentResponse.sagaId,
        SagaStatus.COMPENSATING
      );
      if (approvalOutboxMessage) {
        approvalOutboxMessage.setProcessedAt(new Date());
        approvalOutboxMessage.setOrderStatus(order.orderStatus!);
        approvalOutboxMessage.setSagaStatus(sagaStatus);
        await this.approvalOutboxHelper.save(approvalOutboxMessage);
      }
    }

    console.log('Order with id:', order.getId()!.getValue(), 'is cancelled');
  }

  private async completePaymentForOrder(paymentResponse: PaymentResponse): Promise<OrderPaidEvent> {
    console.log('Completing payment for order with id:', paymentResponse.orderId);
    const order = await this.orderSagaHelper.findOrder(paymentResponse.orderId);
    const domainEvent = this.orderDomainService.payOrder(order);
    await this.orderSagaHelper.saveOrder(order);
    return domainEvent;
  }

  private async rollbackPaymentForOrder(paymentResponse: PaymentResponse): Promise<Order> {
    console.log('Cancelling order with id:', paymentResponse.orderId);
    const order = await this.orderSagaHelper.findOrder(paymentResponse.orderId);
    this.orderDomainService.cancelOrder(order, paymentResponse.failureMessages);
    await this.orderSagaHelper.saveOrder(order);
    return order;
  }

  private getCurrentSagaStatus(paymentStatus: PaymentStatus): SagaStatus[] {
    switch (paymentStatus) {
      case PaymentStatus.COMPLETED:
        return [SagaStatus.STARTED];
      case PaymentStatus.CANCELLED:
        return [SagaStatus.PROCESSING];
      case PaymentStatus.FAILED:
        return [SagaStatus.STARTED, SagaStatus.PROCESSING];
      default:
        return [SagaStatus.STARTED];
    }
  }
}
