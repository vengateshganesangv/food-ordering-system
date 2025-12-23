import { RestaurantId } from '@food-ordering-system/common-domain';
import { OrderApproval } from '../entity/OrderApproval';
import { OrderApprovalEvent } from './OrderApprovalEvent';
export declare class OrderRejectedEvent extends OrderApprovalEvent {
    constructor(orderApproval: OrderApproval, restaurantId: RestaurantId, failureMessages: string[], createdAt: Date);
}
//# sourceMappingURL=OrderRejectedEvent.d.ts.map