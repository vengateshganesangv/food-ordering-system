import { Order } from '../entity/Order';
import { OrderEvent } from './OrderEvent';

/**
 * Order Cancelled Event
 * Published when an order is cancelled
 */
export class OrderCancelledEvent extends OrderEvent {
  constructor(order: Order, createdAt: Date) {
    super(order, createdAt);
  }
}
