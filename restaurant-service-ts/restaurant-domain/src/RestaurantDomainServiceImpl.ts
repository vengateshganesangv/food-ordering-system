import { OrderApprovalStatus } from '@food-ordering-system/common-domain';
import { Restaurant } from './entity/Restaurant';
import { OrderApprovalEvent } from './event/OrderApprovalEvent';
import { OrderApprovedEvent } from './event/OrderApprovedEvent';
import { OrderRejectedEvent } from './event/OrderRejectedEvent';
import { RestaurantDomainService } from './RestaurantDomainService';

export class RestaurantDomainServiceImpl implements RestaurantDomainService {
  validateOrder(restaurant: Restaurant, failureMessages: string[]): OrderApprovalEvent {
    restaurant.validateOrder(failureMessages);
    console.log(`Validating order with id: ${restaurant.getOrderDetail().getId()?.getValue()}`);

    if (failureMessages.length === 0) {
      console.log(`Order is approved for order id: ${restaurant.getOrderDetail().getId()?.getValue()}`);
      restaurant.constructOrderApproval(OrderApprovalStatus.APPROVED);
      return new OrderApprovedEvent(
        restaurant.getOrderApproval()!,
        restaurant.getId()!,
        failureMessages,
        new Date()
      );
    } else {
      console.log(`Order is rejected for order id: ${restaurant.getOrderDetail().getId()?.getValue()}`);
      restaurant.constructOrderApproval(OrderApprovalStatus.REJECTED);
      return new OrderRejectedEvent(
        restaurant.getOrderApproval()!,
        restaurant.getId()!,
        failureMessages,
        new Date()
      );
    }
  }
}
