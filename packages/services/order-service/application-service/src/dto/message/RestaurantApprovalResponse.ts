import { OrderApprovalStatus } from '@food-ordering-system/common-domain';

export class RestaurantApprovalResponse {
  id!: string;
  sagaId!: string;
  orderId!: string;
  restaurantId!: string;
  createdAt!: Date;
  orderApprovalStatus!: OrderApprovalStatus;
  failureMessages!: string[];

  constructor(
    id: string,
    sagaId: string,
    orderId: string,
    restaurantId: string,
    createdAt: Date,
    orderApprovalStatus: OrderApprovalStatus,
    failureMessages: string[]
  ) {
    this.id = id;
    this.sagaId = sagaId;
    this.orderId = orderId;
    this.restaurantId = restaurantId;
    this.createdAt = createdAt;
    this.orderApprovalStatus = orderApprovalStatus;
    this.failureMessages = failureMessages;
  }
}
