import { BaseEntity, OrderId, Money, OrderStatus } from '@food-ordering-system/common-domain';
import { Product } from './Product';

export class OrderDetail extends BaseEntity<OrderId> {
  private orderStatus: OrderStatus;
  private totalAmount: Money;
  private readonly products: Product[];

  private constructor(
    orderId: OrderId,
    orderStatus: OrderStatus,
    totalAmount: Money,
    products: Product[]
  ) {
    super();
    this.setId(orderId);
    this.orderStatus = orderStatus;
    this.totalAmount = totalAmount;
    this.products = products;
  }

  static builder(): OrderDetailBuilder {
    return new OrderDetailBuilder();
  }

  getOrderStatus(): OrderStatus {
    return this.orderStatus;
  }

  getTotalAmount(): Money {
    return this.totalAmount;
  }

  getProducts(): Product[] {
    return this.products;
  }
}

class OrderDetailBuilder {
  private orderId?: OrderId;
  private orderStatus?: OrderStatus;
  private totalAmount?: Money;
  private products?: Product[];

  orderId(val: OrderId): this {
    this.orderId = val;
    return this;
  }

  orderStatus(val: OrderStatus): this {
    this.orderStatus = val;
    return this;
  }

  totalAmount(val: Money): this {
    this.totalAmount = val;
    return this;
  }

  products(val: Product[]): this {
    this.products = val;
    return this;
  }

  build(): OrderDetail {
    if (!this.orderId || !this.orderStatus || !this.totalAmount || !this.products) {
      throw new Error('Missing required fields for OrderDetail');
    }
    return new OrderDetail(this.orderId, this.orderStatus, this.totalAmount, this.products);
  }
}
