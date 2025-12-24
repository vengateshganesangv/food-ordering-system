import { BaseEntity, Money, OrderId } from '@food-ordering-system/common-domain';
import { OrderItemId } from '../valueobject/OrderItemId';
import { Product } from './Product';

/**
 * Order Item entity
 * Represents a single item in an order
 */
export class OrderItem extends BaseEntity<OrderItemId> {
  private orderId?: OrderId;
  private readonly product: Product;
  private readonly quantity: number;
  private readonly price: Money;
  private readonly subTotal: Money;

  constructor(
    orderItemId: OrderItemId | undefined,
    product: Product,
    quantity: number,
    price: Money,
    subTotal: Money,
  ) {
    super();
    if (orderItemId) {
      this.setId(orderItemId);
    }
    this.product = product;
    this.quantity = quantity;
    this.price = price;
    this.subTotal = subTotal;
  }

  initializeOrderItem(orderId: OrderId, orderItemId: OrderItemId): void {
    this.orderId = orderId;
    this.setId(orderItemId);
  }

  isPriceValid(): boolean {
    const productPrice = this.product.getPrice();
    return (
      this.price.isGreaterThanZero() &&
      productPrice !== undefined &&
      this.price.equals(productPrice) &&
      this.price.multiply(this.quantity).equals(this.subTotal)
    );
  }

  static builder(): OrderItemBuilder {
    return new OrderItemBuilder();
  }

  getOrderId(): OrderId | undefined {
    return this.orderId;
  }

  getProduct(): Product {
    return this.product;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getPrice(): Money {
    return this.price;
  }

  getSubTotal(): Money {
    return this.subTotal;
  }
}

class OrderItemBuilder {
  public _orderItemId?: OrderItemId;
  public _product?: Product;
  public _quantity?: number;
  public _price?: Money;
  public _subTotal?: Money;

  orderItemId(val: OrderItemId): this {
    this._orderItemId = val;
    return this;
  }

  product(val: Product): this {
    this._product = val;
    return this;
  }

  quantity(val: number): this {
    this._quantity = val;
    return this;
  }

  price(val: Money): this {
    this._price = val;
    return this;
  }

  subTotal(val: Money): this {
    this._subTotal = val;
    return this;
  }

  build(): OrderItem {
    if (!this._product || this._quantity === undefined || !this._price || !this._subTotal) {
      throw new Error('Missing required fields for OrderItem');
    }
    return new OrderItem(this._orderItemId, this._product, this._quantity, this._price, this._subTotal);
  }
}
