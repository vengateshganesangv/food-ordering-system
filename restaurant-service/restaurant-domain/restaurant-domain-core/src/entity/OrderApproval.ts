import { BaseEntity, OrderId, RestaurantId, OrderApprovalStatus } from '@food-ordering-system/common-domain';
import { OrderApprovalId } from '../valueobject/OrderApprovalId';

export class OrderApproval extends BaseEntity<OrderApprovalId> {
  private readonly restaurantId: RestaurantId;
  private readonly orderId: OrderId;
  private readonly approvalStatus: OrderApprovalStatus;

  private constructor(
    orderApprovalId: OrderApprovalId,
    restaurantId: RestaurantId,
    orderId: OrderId,
    approvalStatus: OrderApprovalStatus
  ) {
    super();
    this.setId(orderApprovalId);
    this.restaurantId = restaurantId;
    this.orderId = orderId;
    this.approvalStatus = approvalStatus;
  }

  static builder(): OrderApprovalBuilder {
    return new OrderApprovalBuilder();
  }

  getRestaurantId(): RestaurantId {
    return this.restaurantId;
  }

  getOrderId(): OrderId {
    return this.orderId;
  }

  getApprovalStatus(): OrderApprovalStatus {
    return this.approvalStatus;
  }
}

class OrderApprovalBuilder {
  private orderApprovalId?: OrderApprovalId;
  private restaurantId?: RestaurantId;
  private orderId?: OrderId;
  private approvalStatus?: OrderApprovalStatus;

  orderApprovalId(val: OrderApprovalId): this {
    this.orderApprovalId = val;
    return this;
  }

  restaurantId(val: RestaurantId): this {
    this.restaurantId = val;
    return this;
  }

  orderId(val: OrderId): this {
    this.orderId = val;
    return this;
  }

  approvalStatus(val: OrderApprovalStatus): this {
    this.approvalStatus = val;
    return this;
  }

  build(): OrderApproval {
    if (!this.orderApprovalId || !this.restaurantId || !this.orderId || !this.approvalStatus) {
      throw new Error('Missing required fields for OrderApproval');
    }
    return new OrderApproval(
      this.orderApprovalId,
      this.restaurantId,
      this.orderId,
      this.approvalStatus
    );
  }
}
