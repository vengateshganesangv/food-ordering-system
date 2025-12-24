import { RestaurantId } from '@food-ordering-system/common-domain';
import { OrderApproval } from '../entity/OrderApproval';
import { OrderApprovalEvent } from './OrderApprovalEvent';

export class OrderApprovedEvent extends OrderApprovalEvent {
  constructor(
    orderApproval: OrderApproval,
    restaurantId: RestaurantId,
    failureMessages: string[],
    createdAt: Date
  ) {
    super(orderApproval, restaurantId, failureMessages, createdAt);
  }
}
