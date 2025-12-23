import { RestaurantApprovalRequest } from '../../../../dto/RestaurantApprovalRequest';

/**
 * Restaurant Approval Request Message Listener (Input Port)
 * Interface for processing restaurant approval requests from message broker
 */
export interface RestaurantApprovalRequestMessageListener {
  /**
   * Approve order based on restaurant approval request
   * @param restaurantApprovalRequest The approval request to process
   */
  approveOrder(restaurantApprovalRequest: RestaurantApprovalRequest): Promise<void>;
}
