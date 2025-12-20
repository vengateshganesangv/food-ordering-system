import { DomainEvent } from '@food-ordering-system/common-domain';
import { Order } from '../entity/Order';

export abstract class OrderEvent implements DomainEvent<Order> {
  private readonly _order: Order;
  private readonly _createdAt: Date;

  constructor(order: Order, createdAt: Date) {
    this._order = order;
    this._createdAt = createdAt;
  }

  get order(): Order {
    return this._order;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
