import { Order } from '@food-ordering-system/order-domain-core';
import { RestaurantApprovalResponse } from './dto/message/RestaurantApprovalResponse';
import { RestaurantApprovalResponseMessageListener } from './ports/input/message/listener/restaurantapproval/RestaurantApprovalResponseMessageListener';
import { OrderApprovalSaga } from './OrderApprovalSaga';

/**
 * Restaurant Approval Response Message Listener Implementation
 * Handles restaurant approval response messages from restaurant service
 */
export class RestaurantApprovalResponseMessageListenerImpl implements RestaurantApprovalResponseMessageListener {
  private static readonly logger = {
    info: (message: string, ...args: any[]) =>
      console.log(`[RestaurantApprovalResponseMessageListenerImpl] ${message}`, ...args),
  };

  constructor(private readonly orderApprovalSaga: OrderApprovalSaga) {}

  async orderApproved(restaurantApprovalResponse: RestaurantApprovalResponse): Promise<void> {
    await this.orderApprovalSaga.process(restaurantApprovalResponse);
    RestaurantApprovalResponseMessageListenerImpl.logger.info(
      `Order is approved for order id: ${restaurantApprovalResponse.getOrderId()}`,
    );
  }

  async orderRejected(restaurantApprovalResponse: RestaurantApprovalResponse): Promise<void> {
    await this.orderApprovalSaga.rollback(restaurantApprovalResponse);
    RestaurantApprovalResponseMessageListenerImpl.logger.info(
      `Order Approval Saga rollback operation is completed for order id: ${restaurantApprovalResponse.getOrderId()} with failure messages: ${restaurantApprovalResponse.getFailureMessages().join(Order.FAILURE_MESSAGE_DELIMITER)}`,
    );
  }
}
