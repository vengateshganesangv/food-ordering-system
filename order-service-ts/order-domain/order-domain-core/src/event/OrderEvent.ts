import { DomainEvent } from '@food-ordering-system/common-domain';
import { Order } from '../entity/Order';

/**
 * Order Event base class
 * Abstract class for all order domain events
 */
export abstract class OrderEvent implements DomainEvent<Order> {
  _phantom?: Order;
  private readonly order: Order;
  private readonly createdAt: Date;

  constructor(order: Order, createdAt: Date) {
    this.order = order;
    this.createdAt = createdAt;
  }

  getOrder(): Order {
    return this.order;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
