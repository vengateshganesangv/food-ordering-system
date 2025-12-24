import { Order } from '../entity/Order';
import { OrderEvent } from './OrderEvent';

/**
 * Order Created Event
 * Published when a new order is successfully created
 */
export class OrderCreatedEvent extends OrderEvent {
  constructor(order: Order, createdAt: Date) {
    super(order, createdAt);
  }
}
