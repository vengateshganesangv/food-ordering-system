import { AggregateRoot, RestaurantId, OrderApprovalStatus, OrderStatus, Money } from '@food-ordering-system/common-domain';
import { OrderApproval } from './OrderApproval';
import { OrderDetail } from './OrderDetail';
import { OrderApprovalId } from '../valueobject/OrderApprovalId';
import { v4 as uuidv4 } from 'uuid';

export class Restaurant extends AggregateRoot<RestaurantId> {
  private orderApproval?: OrderApproval;
  private active: boolean;
  private readonly orderDetail: OrderDetail;

  private constructor(
    restaurantId: RestaurantId,
    orderApproval: OrderApproval | undefined,
    active: boolean,
    orderDetail: OrderDetail
  ) {
    super();
    this.setId(restaurantId);
    this.orderApproval = orderApproval;
    this.active = active;
    this.orderDetail = orderDetail;
  }

  validateOrder(failureMessages: string[]): void {
    if (this.orderDetail.getOrderStatus() !== OrderStatus.PAID) {
      failureMessages.push(`Payment is not completed for order: ${this.orderDetail.getId()?.getValue()}`);
    }

    const totalAmount = this.orderDetail.getProducts().reduce((acc, product) => {
      if (!product.isAvailable()) {
        failureMessages.push(
          `Product with id: ${product.getId()?.getValue()} is not available`
        );
      }
      const price = product.getPrice();
      if (price) {
        return acc.add(price.multiply(product.getQuantity()));
      }
      return acc;
    }, Money.ZERO);

    if (!totalAmount.equals(this.orderDetail.getTotalAmount())) {
      failureMessages.push(`Price total is not correct for order: ${this.orderDetail.getId()?.getValue()}`);
    }
  }

  constructOrderApproval(orderApprovalStatus: OrderApprovalStatus): void {
    this.orderApproval = OrderApproval.builder()
      .orderApprovalId(new OrderApprovalId(uuidv4()))
      .restaurantId(this.getId()!)
      .orderId(this.orderDetail.getId()!)
      .approvalStatus(orderApprovalStatus)
      .build();
  }

  setActive(active: boolean): void {
    this.active = active;
  }

  static builder(): RestaurantBuilder {
    return new RestaurantBuilder();
  }

  getOrderApproval(): OrderApproval | undefined {
    return this.orderApproval;
  }

  isActive(): boolean {
    return this.active;
  }

  getOrderDetail(): OrderDetail {
    return this.orderDetail;
  }
}

class RestaurantBuilder {
  private restaurantId?: RestaurantId;
  private orderApproval?: OrderApproval;
  private active: boolean = false;
  private orderDetail?: OrderDetail;

  restaurantId(val: RestaurantId): this {
    this.restaurantId = val;
    return this;
  }

  orderApproval(val: OrderApproval): this {
    this.orderApproval = val;
    return this;
  }

  active(val: boolean): this {
    this.active = val;
    return this;
  }

  orderDetail(val: OrderDetail): this {
    this.orderDetail = val;
    return this;
  }

  build(): Restaurant {
    if (!this.restaurantId || !this.orderDetail) {
      throw new Error('Missing required fields for Restaurant');
    }
    return new Restaurant(this.restaurantId, this.orderApproval, this.active, this.orderDetail);
  }
}
