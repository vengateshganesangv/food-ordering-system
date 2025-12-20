import { BaseEntity, RestaurantId, OrderId, OrderApprovalStatus } from '@food-ordering-system/common-domain';
import { OrderApprovalId } from '../valueobject/OrderApprovalId';

interface OrderApprovalProps {
  orderApprovalId?: OrderApprovalId;
  restaurantId: RestaurantId;
  orderId: OrderId;
  approvalStatus: OrderApprovalStatus;
}

export class OrderApproval extends BaseEntity<OrderApprovalId> {
  private readonly _restaurantId: RestaurantId;
  private readonly _orderId: OrderId;
  private readonly _approvalStatus: OrderApprovalStatus;

  private constructor(props: OrderApprovalProps) {
    super();
    if (props.orderApprovalId) {
      this.setId(props.orderApprovalId);
    }
    this._restaurantId = props.restaurantId;
    this._orderId = props.orderId;
    this._approvalStatus = props.approvalStatus;
  }

  static builder(): OrderApprovalBuilder {
    return new OrderApprovalBuilder();
  }

  get restaurantId(): RestaurantId {
    return this._restaurantId;
  }

  get orderId(): OrderId {
    return this._orderId;
  }

  get approvalStatus(): OrderApprovalStatus {
    return this._approvalStatus;
  }
}

class OrderApprovalBuilder {
  private orderApprovalId?: OrderApprovalId;
  private restaurantId?: RestaurantId;
  private orderId?: OrderId;
  private approvalStatus?: OrderApprovalStatus;

  setOrderApprovalId(orderApprovalId: OrderApprovalId): OrderApprovalBuilder {
    this.orderApprovalId = orderApprovalId;
    return this;
  }

  setRestaurantId(restaurantId: RestaurantId): OrderApprovalBuilder {
    this.restaurantId = restaurantId;
    return this;
  }

  setOrderId(orderId: OrderId): OrderApprovalBuilder {
    this.orderId = orderId;
    return this;
  }

  setApprovalStatus(approvalStatus: OrderApprovalStatus): OrderApprovalBuilder {
    this.approvalStatus = approvalStatus;
    return this;
  }

  build(): OrderApproval {
    if (!this.restaurantId || !this.orderId || !this.approvalStatus) {
      throw new Error('RestaurantId, OrderId, and ApprovalStatus are required');
    }
    return new OrderApproval({
      orderApprovalId: this.orderApprovalId,
      restaurantId: this.restaurantId,
      orderId: this.orderId,
      approvalStatus: this.approvalStatus,
    });
  }
}
