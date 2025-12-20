import { DomainEvent, RestaurantId } from '@food-ordering-system/common-domain';
import { OrderApproval } from '../entity/OrderApproval';

export abstract class OrderApprovalEvent implements DomainEvent<OrderApproval> {
  private readonly _orderApproval: OrderApproval;
  private readonly _restaurantId: RestaurantId;
  private readonly _failureMessages: string[];
  private readonly _createdAt: Date;

  constructor(orderApproval: OrderApproval, restaurantId: RestaurantId, failureMessages: string[], createdAt: Date) {
    this._orderApproval = orderApproval;
    this._restaurantId = restaurantId;
    this._failureMessages = failureMessages;
    this._createdAt = createdAt;
  }

  get orderApproval(): OrderApproval {
    return this._orderApproval;
  }

  get restaurantId(): RestaurantId {
    return this._restaurantId;
  }

  get failureMessages(): string[] {
    return this._failureMessages;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
