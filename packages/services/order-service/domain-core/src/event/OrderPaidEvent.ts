import { Order } from '../entity/Order';
import { OrderEvent } from './OrderEvent';

export class OrderPaidEvent extends OrderEvent {
  constructor(order: Order, createdAt: Date) {
    super(order, createdAt);
  }
}
