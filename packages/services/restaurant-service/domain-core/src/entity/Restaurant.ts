import { AggregateRoot, RestaurantId, Money, OrderStatus, OrderApprovalStatus } from '@food-ordering-system/common-domain';
import { OrderApproval } from './OrderApproval';
import { OrderDetail } from './OrderDetail';
import { OrderApprovalId } from '../valueobject/OrderApprovalId';
import { v4 as uuidv4 } from 'uuid';

interface RestaurantProps {
  restaurantId?: RestaurantId;
  orderApproval?: OrderApproval;
  active: boolean;
  orderDetail: OrderDetail;
}

export class Restaurant extends AggregateRoot<RestaurantId> {
  private _orderApproval?: OrderApproval;
  private _active: boolean;
  private readonly _orderDetail: OrderDetail;

  private constructor(props: RestaurantProps) {
    super();
    if (props.restaurantId) {
      this.setId(props.restaurantId);
    }
    this._orderApproval = props.orderApproval;
    this._active = props.active;
    this._orderDetail = props.orderDetail;
  }

  static builder(): RestaurantBuilder {
    return new RestaurantBuilder();
  }

  validateOrder(failureMessages: string[]): void {
    if (this._orderDetail.orderStatus !== OrderStatus.PAID) {
      failureMessages.push(`Payment is not completed for order: ${this._orderDetail.getId()!.getValue()}`);
    }
    const totalAmount = this._orderDetail.products
      .map((product) => {
        if (!product.isAvailable()) {
          failureMessages.push(`Product with id: ${product.getId()!.getValue()} is not available`);
        }
        return product.price!.multiply(product.quantity);
      })
      .reduce((acc, price) => acc.add(price), Money.ZERO);

    if (!totalAmount.equals(this._orderDetail.totalAmount)) {
      failureMessages.push(`Price total is not correct for order: ${this._orderDetail.getId()!.getValue()}`);
    }
  }

  constructOrderApproval(orderApprovalStatus: OrderApprovalStatus): void {
    this._orderApproval = OrderApproval.builder()
      .setOrderApprovalId(new OrderApprovalId(uuidv4()))
      .setRestaurantId(this.getId()!)
      .setOrderId(this._orderDetail.getId()!)
      .setApprovalStatus(orderApprovalStatus)
      .build();
  }

  setActive(active: boolean): void {
    this._active = active;
  }

  get orderApproval(): OrderApproval | undefined {
    return this._orderApproval;
  }

  get active(): boolean {
    return this._active;
  }

  get orderDetail(): OrderDetail {
    return this._orderDetail;
  }

  isActive(): boolean {
    return this._active;
  }
}

class RestaurantBuilder {
  private restaurantId?: RestaurantId;
  private orderApproval?: OrderApproval;
  private active: boolean = false;
  private orderDetail?: OrderDetail;

  setRestaurantId(restaurantId: RestaurantId): RestaurantBuilder {
    this.restaurantId = restaurantId;
    return this;
  }

  setOrderApproval(orderApproval: OrderApproval): RestaurantBuilder {
    this.orderApproval = orderApproval;
    return this;
  }

  setActive(active: boolean): RestaurantBuilder {
    this.active = active;
    return this;
  }

  setOrderDetail(orderDetail: OrderDetail): RestaurantBuilder {
    this.orderDetail = orderDetail;
    return this;
  }

  build(): Restaurant {
    if (!this.orderDetail) {
      throw new Error('OrderDetail is required');
    }
    return new Restaurant({
      restaurantId: this.restaurantId,
      orderApproval: this.orderApproval,
      active: this.active,
      orderDetail: this.orderDetail,
    });
  }
}
