import { injectable } from 'tsyringe';
import { OrderApprovalStatus } from '@food-ordering-system/common-domain';
import { RestaurantDomainService } from './RestaurantDomainService';
import { Restaurant } from './entity/Restaurant';
import { OrderApprovalEvent } from './event/OrderApprovalEvent';
import { OrderApprovedEvent } from './event/OrderApprovedEvent';
import { OrderRejectedEvent } from './event/OrderRejectedEvent';

@injectable()
export class RestaurantDomainServiceImpl implements RestaurantDomainService {
  validateOrder(restaurant: Restaurant, failureMessages: string[]): OrderApprovalEvent {
    restaurant.validateOrder(failureMessages);
    console.log(`Validating order with id: ${restaurant.orderDetail.getId()!.getValue()}`);

    if (failureMessages.length === 0) {
      console.log(`Order is approved for order id: ${restaurant.orderDetail.getId()!.getValue()}`);
      restaurant.constructOrderApproval(OrderApprovalStatus.APPROVED);
      return new OrderApprovedEvent(restaurant.orderApproval!, restaurant.getId()!, failureMessages, new Date());
    } else {
      console.log(`Order is rejected for order id: ${restaurant.orderDetail.getId()!.getValue()}`);
      restaurant.constructOrderApproval(OrderApprovalStatus.REJECTED);
      return new OrderRejectedEvent(restaurant.orderApproval!, restaurant.getId()!, failureMessages, new Date());
    }
  }
}
