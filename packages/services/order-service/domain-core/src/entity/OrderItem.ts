import { BaseEntity, OrderId, Money } from '@food-ordering-system/common-domain';
import { OrderItemId } from '../valueobject/OrderItemId';
import { Product } from './Product';

interface OrderItemProps {
  orderItemId?: OrderItemId;
  product: Product;
  quantity: number;
  price: Money;
  subTotal: Money;
}

export class OrderItem extends BaseEntity<OrderItemId> {
  private _orderId?: OrderId;
  private readonly _product: Product;
  private readonly _quantity: number;
  private readonly _price: Money;
  private readonly _subTotal: Money;

  private constructor(props: OrderItemProps) {
    super();
    if (props.orderItemId) {
      this.setId(props.orderItemId);
    }
    this._product = props.product;
    this._quantity = props.quantity;
    this._price = props.price;
    this._subTotal = props.subTotal;
  }

  static builder(): OrderItemBuilder {
    return new OrderItemBuilder();
  }

  initializeOrderItem(orderId: OrderId, orderItemId: OrderItemId): void {
    this._orderId = orderId;
    this.setId(orderItemId);
  }

  isPriceValid(): boolean {
    return (
      this._price.isGreaterThanZero() &&
      this._price.equals(this._product.price!) &&
      this._price.multiply(this._quantity).equals(this._subTotal)
    );
  }

  get orderId(): OrderId | undefined {
    return this._orderId;
  }

  get product(): Product {
    return this._product;
  }

  get quantity(): number {
    return this._quantity;
  }

  get price(): Money {
    return this._price;
  }

  get subTotal(): Money {
    return this._subTotal;
  }
}

class OrderItemBuilder {
  private orderItemId?: OrderItemId;
  private product?: Product;
  private quantity: number = 0;
  private price?: Money;
  private subTotal?: Money;

  setOrderItemId(orderItemId: OrderItemId): OrderItemBuilder {
    this.orderItemId = orderItemId;
    return this;
  }

  setProduct(product: Product): OrderItemBuilder {
    this.product = product;
    return this;
  }

  setQuantity(quantity: number): OrderItemBuilder {
    this.quantity = quantity;
    return this;
  }

  setPrice(price: Money): OrderItemBuilder {
    this.price = price;
    return this;
  }

  setSubTotal(subTotal: Money): OrderItemBuilder {
    this.subTotal = subTotal;
    return this;
  }

  build(): OrderItem {
    if (!this.product || !this.price || !this.subTotal) {
      throw new Error('Product, price, and subTotal are required');
    }
    return new OrderItem({
      orderItemId: this.orderItemId,
      product: this.product,
      quantity: this.quantity,
      price: this.price,
      subTotal: this.subTotal,
    });
  }
}
