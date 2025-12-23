import { Restaurant } from './entity/Restaurant';
import { OrderApprovalEvent } from './event/OrderApprovalEvent';
import { RestaurantDomainService } from './RestaurantDomainService';
export declare class RestaurantDomainServiceImpl implements RestaurantDomainService {
    validateOrder(restaurant: Restaurant, failureMessages: string[]): OrderApprovalEvent;
}
//# sourceMappingURL=RestaurantDomainServiceImpl.d.ts.map