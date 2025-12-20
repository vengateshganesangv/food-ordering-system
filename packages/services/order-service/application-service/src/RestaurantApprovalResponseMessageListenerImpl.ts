import { injectable } from 'tsyringe';
import { RestaurantApprovalResponseMessageListener } from './ports/input/message/listener/restaurantapproval/RestaurantApprovalResponseMessageListener';
import { RestaurantApprovalResponse } from './dto/message/RestaurantApprovalResponse';
import { OrderApprovalSaga } from './OrderApprovalSaga';

@injectable()
export class RestaurantApprovalResponseMessageListenerImpl implements RestaurantApprovalResponseMessageListener {
  constructor(private orderApprovalSaga: OrderApprovalSaga) {}

  async orderApproved(restaurantApprovalResponse: RestaurantApprovalResponse): Promise<void> {
    await this.orderApprovalSaga.process(restaurantApprovalResponse);
  }

  async orderRejected(restaurantApprovalResponse: RestaurantApprovalResponse): Promise<void> {
    await this.orderApprovalSaga.rollback(restaurantApprovalResponse);
  }
}
