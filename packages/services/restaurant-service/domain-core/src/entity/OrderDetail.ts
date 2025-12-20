import { BaseEntity, OrderId, OrderStatus, Money } from '@food-ordering-system/common-domain';
import { Product } from './Product';

interface OrderDetailProps {
  orderId: OrderId;
  orderStatus: OrderStatus;
  totalAmount: Money;
  products: Product[];
}

export class OrderDetail extends BaseEntity<OrderId> {
  private readonly _orderStatus: OrderStatus;
  private readonly _totalAmount: Money;
  private readonly _products: Product[];

  private constructor(props: OrderDetailProps) {
    super();
    this.setId(props.orderId);
    this._orderStatus = props.orderStatus;
    this._totalAmount = props.totalAmount;
    this._products = props.products;
  }

  static builder(): OrderDetailBuilder {
    return new OrderDetailBuilder();
  }

  get orderStatus(): OrderStatus {
    return this._orderStatus;
  }

  get totalAmount(): Money {
    return this._totalAmount;
  }

  get products(): Product[] {
    return this._products;
  }
}

class OrderDetailBuilder {
  private orderId?: OrderId;
  private orderStatus?: OrderStatus;
  private totalAmount?: Money;
  private products: Product[] = [];

  setOrderId(orderId: OrderId): OrderDetailBuilder {
    this.orderId = orderId;
    return this;
  }

  setOrderStatus(orderStatus: OrderStatus): OrderDetailBuilder {
    this.orderStatus = orderStatus;
    return this;
  }

  setTotalAmount(totalAmount: Money): OrderDetailBuilder {
    this.totalAmount = totalAmount;
    return this;
  }

  setProducts(products: Product[]): OrderDetailBuilder {
    this.products = products;
    return this;
  }

  build(): OrderDetail {
    if (!this.orderId || !this.orderStatus || !this.totalAmount) {
      throw new Error('OrderId, OrderStatus, and TotalAmount are required');
    }
    return new OrderDetail({
      orderId: this.orderId,
      orderStatus: this.orderStatus,
      totalAmount: this.totalAmount,
      products: this.products,
    });
  }
}
