import { RestaurantId } from '@food-ordering-system/common-domain';
import { OrderApprovalEvent } from './OrderApprovalEvent';
import { OrderApproval } from '../entity/OrderApproval';

export class OrderRejectedEvent extends OrderApprovalEvent {
  constructor(orderApproval: OrderApproval, restaurantId: RestaurantId, failureMessages: string[], createdAt: Date) {
    super(orderApproval, restaurantId, failureMessages, createdAt);
  }
}
