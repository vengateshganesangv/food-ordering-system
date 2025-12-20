import { injectable } from 'tsyringe';
import { RestaurantApprovalRequestMessageListener } from './ports/input/message/RestaurantApprovalRequestMessageListener';
import { RestaurantApprovalRequest } from './dto/RestaurantApprovalRequest';
import { RestaurantApprovalRequestHelper } from './RestaurantApprovalRequestHelper';

@injectable()
export class RestaurantApprovalRequestMessageListenerImpl implements RestaurantApprovalRequestMessageListener {
  constructor(private readonly restaurantApprovalRequestHelper: RestaurantApprovalRequestHelper) {}

  async approveOrder(restaurantApprovalRequest: RestaurantApprovalRequest): Promise<void> {
    await this.restaurantApprovalRequestHelper.persistOrderApproval(restaurantApprovalRequest);
  }
}
