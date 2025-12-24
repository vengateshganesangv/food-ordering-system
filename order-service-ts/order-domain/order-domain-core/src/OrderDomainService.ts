import { Order } from './entity/Order';
import { Restaurant } from './entity/Restaurant';
import { OrderCreatedEvent } from './event/OrderCreatedEvent';
import { OrderPaidEvent } from './event/OrderPaidEvent';
import { OrderCancelledEvent } from './event/OrderCancelledEvent';

/**
 * Order Domain Service interface
 * Defines domain operations for orders
 */
export interface OrderDomainService {
  /**
   * Validate and initiate a new order
   * @param order Order to be initiated
   * @param restaurant Restaurant information
   * @returns OrderCreatedEvent
   */
  validateAndInitiateOrder(order: Order, restaurant: Restaurant): OrderCreatedEvent;

  /**
   * Process payment for an order
   * @param order Order to be paid
   * @returns OrderPaidEvent
   */
  payOrder(order: Order): OrderPaidEvent;

  /**
   * Approve an order after restaurant approval
   * @param order Order to be approved
   */
  approveOrder(order: Order): void;

  /**
   * Cancel order payment
   * @param order Order to cancel payment for
   * @param failureMessages Failure reasons
   * @returns OrderCancelledEvent
   */
  cancelOrderPayment(order: Order, failureMessages: string[]): OrderCancelledEvent;

  /**
   * Cancel an order
   * @param order Order to cancel
   * @param failureMessages Failure reasons
   */
  cancelOrder(order: Order, failureMessages: string[]): void;
}
