import { AggregateRoot, OrderId, CustomerId, RestaurantId, Money, OrderStatus } from '@food-ordering/common-domain';
import { OrderItem } from './OrderItem';

export class Order extends AggregateRoot<OrderId> {
  private status: OrderStatus;

  constructor(
    orderId: OrderId,
    private readonly customerId: CustomerId,
    private readonly restaurantId: RestaurantId,
    private readonly items: OrderItem[],
    private readonly price: Money,
    status: OrderStatus = OrderStatus.PENDING,
  ) {
    super();
    this.setId(orderId);
    this.status = status;
  }

  getCustomerId(): CustomerId {
    return this.customerId;
  }

  getRestaurantId(): RestaurantId {
    return this.restaurantId;
  }

  getItems(): OrderItem[] {
    return this.items;
  }

  getPrice(): Money {
    return this.price;
  }

  getStatus(): OrderStatus {
    return this.status;
  }

  setStatus(status: OrderStatus): void {
    this.status = status;
  }

  validateOrder(): void {
    if (!this.price.isGreaterThanZero()) {
      throw new Error('Total price must be greater than zero');
    }
    if (this.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }
  }
}
