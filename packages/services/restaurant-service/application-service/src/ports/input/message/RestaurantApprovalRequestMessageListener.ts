import { RestaurantApprovalRequest } from '../../../dto/RestaurantApprovalRequest';

export interface RestaurantApprovalRequestMessageListener {
  approveOrder(restaurantApprovalRequest: RestaurantApprovalRequest): Promise<void>;
}
