import { RestaurantApprovalRequestMessageListener } from './ports/input/message/listener/RestaurantApprovalRequestMessageListener';
import { RestaurantApprovalRequest } from './dto/RestaurantApprovalRequest';
import { RestaurantApprovalRequestHelper } from './RestaurantApprovalRequestHelper';
import { Logger } from '@food-ordering-system/kafka-producer';

/**
 * Restaurant Approval Request Message Listener Implementation
 * Implements the input port for processing restaurant approval requests
 */
export class RestaurantApprovalRequestMessageListenerImpl
  implements RestaurantApprovalRequestMessageListener
{
  private readonly logger: Logger;

  constructor(
    private readonly restaurantApprovalRequestHelper: RestaurantApprovalRequestHelper,
    logger?: Logger,
  ) {
    this.logger = logger || console;
  }

  /**
   * Approve order - processes the restaurant approval request
   * Delegates to the helper for business logic execution
   */
  async approveOrder(restaurantApprovalRequest: RestaurantApprovalRequest): Promise<void> {
    try {
      this.logger.info(
        `Received restaurant approval request for order id: ${restaurantApprovalRequest.orderId}`,
      );

      await this.restaurantApprovalRequestHelper.persistOrderApproval(restaurantApprovalRequest);

      this.logger.info(
        `Restaurant approval request processed successfully for order id: ${restaurantApprovalRequest.orderId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error processing restaurant approval request for order id: ${restaurantApprovalRequest.orderId}`,
        error,
      );
      throw error;
    }
  }
}
