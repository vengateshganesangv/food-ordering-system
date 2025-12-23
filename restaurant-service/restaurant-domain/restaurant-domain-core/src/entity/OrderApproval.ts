import { BaseEntity, OrderId, RestaurantId, OrderApprovalStatus } from '@food-ordering-system/common-domain';
import { OrderApprovalId } from '../valueobject/OrderApprovalId';

export class OrderApproval extends BaseEntity<OrderApprovalId> {
  private readonly restaurantId: RestaurantId;
  private readonly orderId: OrderId;
  private readonly approvalStatus: OrderApprovalStatus;

  constructor(
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
  private _orderApprovalId?: OrderApprovalId;
  private _restaurantId?: RestaurantId;
  private _orderId?: OrderId;
  private _approvalStatus?: OrderApprovalStatus;

  orderApprovalId(val: OrderApprovalId): this {
    this._orderApprovalId = val;
    return this;
  }

  restaurantId(val: RestaurantId): this {
    this._restaurantId = val;
    return this;
  }

  orderId(val: OrderId): this {
    this._orderId = val;
    return this;
  }

  approvalStatus(val: OrderApprovalStatus): this {
    this._approvalStatus = val;
    return this;
  }

  build(): OrderApproval {
    if (!this._orderApprovalId || !this._restaurantId || !this._orderId || !this._approvalStatus) {
      throw new Error('Missing required fields for OrderApproval');
    }
    return new OrderApproval(
      this._orderApprovalId,
      this._restaurantId,
      this._orderId,
      this._approvalStatus
    );
  }
}
