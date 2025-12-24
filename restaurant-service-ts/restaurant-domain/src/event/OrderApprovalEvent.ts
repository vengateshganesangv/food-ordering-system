import { DomainEvent, RestaurantId } from '@food-ordering-system/common-domain';
import { OrderApproval } from '../entity/OrderApproval';

export abstract class OrderApprovalEvent implements DomainEvent<OrderApproval> {
  _phantom?: OrderApproval;
  private readonly orderApproval: OrderApproval;
  private readonly restaurantId: RestaurantId;
  private readonly failureMessages: string[];
  private readonly createdAt: Date;

  constructor(
    orderApproval: OrderApproval,
    restaurantId: RestaurantId,
    failureMessages: string[],
    createdAt: Date
  ) {
    this.orderApproval = orderApproval;
    this.restaurantId = restaurantId;
    this.failureMessages = failureMessages;
    this.createdAt = createdAt;
  }

  getOrderApproval(): OrderApproval {
    return this.orderApproval;
  }

  getRestaurantId(): RestaurantId {
    return this.restaurantId;
  }

  getFailureMessages(): string[] {
    return this.failureMessages;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
