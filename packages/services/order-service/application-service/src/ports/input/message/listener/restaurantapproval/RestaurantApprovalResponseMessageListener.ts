import { RestaurantApprovalResponse } from '../../../../../dto/message/RestaurantApprovalResponse';

export interface RestaurantApprovalResponseMessageListener {
  orderApproved(restaurantApprovalResponse: RestaurantApprovalResponse): Promise<void>;
  orderRejected(restaurantApprovalResponse: RestaurantApprovalResponse): Promise<void>;
}
