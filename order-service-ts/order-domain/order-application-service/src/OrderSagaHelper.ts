import { OrderId, OrderStatus, SagaStatus } from '@food-ordering-system/common-domain';
import { Order, OrderNotFoundException } from '@food-ordering-system/order-domain-core';
import { OrderRepository } from './ports/output/repository/OrderRepository';

/**
 * Order Saga Helper
 * Helper class for SAGA orchestration
 */
export class OrderSagaHelper {
  private static readonly logger = {
    info: (message: string, ...args: any[]) => console.log(`[OrderSagaHelper] ${message}`, ...args),
    error: (message: string, ...args: any[]) => console.error(`[OrderSagaHelper] ${message}`, ...args),
  };

  constructor(private readonly orderRepository: OrderRepository) {}

  async findOrder(orderId: string): Promise<Order> {
    const orderResponse = await this.orderRepository.findById(new OrderId(orderId));
    if (!orderResponse) {
      OrderSagaHelper.logger.error(`Order with id: ${orderId} could not be found!`);
      throw new OrderNotFoundException(`Order with id ${orderId} could not be found!`);
    }
    return orderResponse;
  }

  async saveOrder(order: Order): Promise<void> {
    await this.orderRepository.save(order);
  }

  orderStatusToSagaStatus(orderStatus: OrderStatus): SagaStatus {
    switch (orderStatus) {
      case OrderStatus.PAID:
        return SagaStatus.PROCESSING;
      case OrderStatus.APPROVED:
        return SagaStatus.SUCCEEDED;
      case OrderStatus.CANCELLING:
        return SagaStatus.COMPENSATING;
      case OrderStatus.CANCELLED:
        return SagaStatus.COMPENSATED;
      default:
        return SagaStatus.STARTED;
    }
  }
}
