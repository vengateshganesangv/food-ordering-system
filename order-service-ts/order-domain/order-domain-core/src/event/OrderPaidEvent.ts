import { Order } from '../entity/Order';
import { OrderEvent } from './OrderEvent';

/**
 * Order Paid Event
 * Published when a payment for an order is successful
 */
export class OrderPaidEvent extends OrderEvent {
  constructor(order: Order, createdAt: Date) {
    super(order, createdAt);
  }
}
