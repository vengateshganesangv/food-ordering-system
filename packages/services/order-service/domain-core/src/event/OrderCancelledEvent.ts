import { Order } from '../entity/Order';
import { OrderEvent } from './OrderEvent';

export class OrderCancelledEvent extends OrderEvent {
  constructor(order: Order, createdAt: Date) {
    super(order, createdAt);
  }
}
