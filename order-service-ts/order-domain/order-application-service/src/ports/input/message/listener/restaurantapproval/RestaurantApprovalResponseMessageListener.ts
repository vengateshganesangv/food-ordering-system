import { RestaurantApprovalResponse } from '../../../../../dto/message/RestaurantApprovalResponse';

/**
 * Restaurant Approval Response Message Listener interface
 * Input port for handling restaurant approval response messages
 */
export interface RestaurantApprovalResponseMessageListener {
  /**
   * Handles order approved event
   * @param restaurantApprovalResponse Approval response from restaurant service
   */
  orderApproved(restaurantApprovalResponse: RestaurantApprovalResponse): Promise<void>;

  /**
   * Handles order rejected event
   * @param restaurantApprovalResponse Approval response from restaurant service
   */
  orderRejected(restaurantApprovalResponse: RestaurantApprovalResponse): Promise<void>;
}
