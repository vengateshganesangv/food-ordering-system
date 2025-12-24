import { BaseEntity, OrderId, Money, OrderStatus } from '@food-ordering-system/common-domain';
import { Product } from './Product';

export class OrderDetail extends BaseEntity<OrderId> {
  private orderStatus: OrderStatus;
  private totalAmount: Money;
  private readonly products: Product[];

  constructor(
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
  private _orderId?: OrderId;
  private _orderStatus?: OrderStatus;
  private _totalAmount?: Money;
  private _products?: Product[];

  orderId(val: OrderId): this {
    this._orderId = val;
    return this;
  }

  orderStatus(val: OrderStatus): this {
    this._orderStatus = val;
    return this;
  }

  totalAmount(val: Money): this {
    this._totalAmount = val;
    return this;
  }

  products(val: Product[]): this {
    this._products = val;
    return this;
  }

  build(): OrderDetail {
    if (!this._orderId || !this._orderStatus || !this._totalAmount || !this._products) {
      throw new Error('Missing required fields for OrderDetail');
    }
    return new OrderDetail(this._orderId, this._orderStatus, this._totalAmount, this._products);
  }
}
