import { Restaurant } from './entity/Restaurant';
import { OrderApprovalEvent } from './event/OrderApprovalEvent';
export interface RestaurantDomainService {
    validateOrder(restaurant: Restaurant, failureMessages: string[]): OrderApprovalEvent;
}
//# sourceMappingURL=RestaurantDomainService.d.ts.map