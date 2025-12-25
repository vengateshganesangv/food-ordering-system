import { OrderId, OrderStatus, PaymentStatus } from '@food-ordering-system/common-domain';
import { SagaStatus, SagaStep } from '@food-ordering-system/saga';
import { OrderDomainService, Order, OrderPaidEvent, OrderNotFoundException } from '@food-ordering-system/order-domain-core';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { PaymentResponse } from './dto/message/PaymentResponse';
import { OrderDataMapper } from './mapper/OrderDataMapper';
import { OrderPaymentOutboxMessage } from './outbox/model/payment/OrderPaymentOutboxMessage';
import { OrderApprovalOutboxMessage } from './outbox/model/approval/OrderApprovalOutboxMessage';
import { PaymentOutboxHelper } from './outbox/scheduler/payment/PaymentOutboxHelper';
import { ApprovalOutboxHelper } from './outbox/scheduler/approval/ApprovalOutboxHelper';
import { OrderRepository } from './ports/output/repository/OrderRepository';
import { OrderSagaHelper } from './OrderSagaHelper';

/**
 * Order Payment Saga
 * Coordinates payment transactions in the order SAGA
 */
export class OrderPaymentSaga implements SagaStep<PaymentResponse> {
  private static readonly logger = {
    info: (message: string, ...args: any[]) => console.log(`[OrderPaymentSaga] ${message}`, ...args),
    error: (message: string, ...args: any[]) => console.error(`[OrderPaymentSaga] ${message}`, ...args),
  };

  constructor(
    private readonly orderDomainService: OrderDomainService,
    private readonly orderRepository: OrderRepository,
    private readonly paymentOutboxHelper: PaymentOutboxHelper,
    private readonly approvalOutboxHelper: ApprovalOutboxHelper,
    private readonly orderSagaHelper: OrderSagaHelper,
    private readonly orderDataMapper: OrderDataMapper,
  ) {}

  async process(paymentResponse: PaymentResponse): Promise<void> {
    const orderPaymentOutboxMessageResponse =
      await this.paymentOutboxHelper.getPaymentOutboxMessageBySagaIdAndSagaStatus(
        paymentResponse.getSagaId(),
        SagaStatus.STARTED,
      );

    if (!orderPaymentOutboxMessageResponse) {
      OrderPaymentSaga.logger.info(
        `An outbox message with saga id: ${paymentResponse.getSagaId()} is already processed!`,
      );
      return;
    }

    const orderPaymentOutboxMessage = orderPaymentOutboxMessageResponse;

    const domainEvent = await this.completePaymentForOrder(paymentResponse);

    const sagaStatus = this.orderSagaHelper.orderStatusToSagaStatus(domainEvent.getOrder().getOrderStatus()!);

    await this.paymentOutboxHelper.save(
      this.getUpdatedPaymentOutboxMessage(orderPaymentOutboxMessage, domainEvent.getOrder().getOrderStatus()!, sagaStatus),
    );

    await this.approvalOutboxHelper.saveApprovalOutboxMessage(
      this.orderDataMapper.orderPaidEventToOrderApprovalEventPayload(domainEvent),
      domainEvent.getOrder().getOrderStatus()!,
      sagaStatus,
      OutboxStatus.STARTED,
      paymentResponse.getSagaId(),
    );

    const orderId = domainEvent.getOrder().getId();
    OrderPaymentSaga.logger.info(`Order with id: ${orderId ? orderId.getValue() : 'unknown'} is paid`);
  }

  async rollback(paymentResponse: PaymentResponse): Promise<void> {
    const orderPaymentOutboxMessageResponse =
      await this.paymentOutboxHelper.getPaymentOutboxMessageBySagaIdAndSagaStatus(
        paymentResponse.getSagaId(),
        ...this.getCurrentSagaStatus(paymentResponse.getPaymentStatus()),
      );

    if (!orderPaymentOutboxMessageResponse) {
      OrderPaymentSaga.logger.info(
        `An outbox message with saga id: ${paymentResponse.getSagaId()} is already roll backed!`,
      );
      return;
    }

    const orderPaymentOutboxMessage = orderPaymentOutboxMessageResponse;

    const order = await this.rollbackPaymentForOrder(paymentResponse);

    const sagaStatus = this.orderSagaHelper.orderStatusToSagaStatus(order.getOrderStatus()!);

    await this.paymentOutboxHelper.save(
      this.getUpdatedPaymentOutboxMessage(orderPaymentOutboxMessage, order.getOrderStatus()!, sagaStatus),
    );

    if (paymentResponse.getPaymentStatus() === PaymentStatus.CANCELLED) {
      await this.approvalOutboxHelper.save(
        await this.getUpdatedApprovalOutboxMessage(paymentResponse.getSagaId(), order.getOrderStatus()!, sagaStatus),
      );
    }

    const orderId = order.getId();
    OrderPaymentSaga.logger.info(`Order with id: ${orderId ? orderId.getValue() : 'unknown'} is cancelled`);
  }

  private async findOrder(orderId: string): Promise<Order> {
    const orderResponse = await this.orderRepository.findById(new OrderId(orderId));
    if (!orderResponse) {
      OrderPaymentSaga.logger.error(`Order with id: ${orderId} could not be found!`);
      throw new OrderNotFoundException(`Order with id ${orderId} could not be found!`);
    }
    return orderResponse;
  }

  private getUpdatedPaymentOutboxMessage(
    orderPaymentOutboxMessage: OrderPaymentOutboxMessage,
    orderStatus: OrderStatus,
    sagaStatus: SagaStatus,
  ): OrderPaymentOutboxMessage {
    orderPaymentOutboxMessage.setProcessedAt(new Date());
    orderPaymentOutboxMessage.setOrderStatus(orderStatus);
    orderPaymentOutboxMessage.setSagaStatus(sagaStatus);
    return orderPaymentOutboxMessage;
  }

  private async completePaymentForOrder(paymentResponse: PaymentResponse): Promise<OrderPaidEvent> {
    OrderPaymentSaga.logger.info(`Completing payment for order with id: ${paymentResponse.getOrderId()}`);
    const order = await this.findOrder(paymentResponse.getOrderId());
    const domainEvent = this.orderDomainService.payOrder(order);
    await this.orderRepository.save(order);
    return domainEvent;
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

  private async rollbackPaymentForOrder(paymentResponse: PaymentResponse): Promise<Order> {
    OrderPaymentSaga.logger.info(`Cancelling order with id: ${paymentResponse.getOrderId()}`);
    const order = await this.findOrder(paymentResponse.getOrderId());
    this.orderDomainService.cancelOrder(order, paymentResponse.getFailureMessages());
    await this.orderRepository.save(order);
    return order;
  }

  private async getUpdatedApprovalOutboxMessage(
    sagaId: string,
    orderStatus: OrderStatus,
    sagaStatus: SagaStatus,
  ): Promise<OrderApprovalOutboxMessage> {
    const orderApprovalOutboxMessageResponse =
      await this.approvalOutboxHelper.getApprovalOutboxMessageBySagaIdAndSagaStatus(sagaId, SagaStatus.COMPENSATING);
    if (!orderApprovalOutboxMessageResponse) {
      throw new Error(`Approval outbox message could not be found in ${SagaStatus.COMPENSATING} status!`);
    }
    const orderApprovalOutboxMessage = orderApprovalOutboxMessageResponse;
    orderApprovalOutboxMessage.setProcessedAt(new Date());
    orderApprovalOutboxMessage.setOrderStatus(orderStatus);
    orderApprovalOutboxMessage.setSagaStatus(sagaStatus);
    return orderApprovalOutboxMessage;
  }
}
