import { DomainEvent, RestaurantId } from '@food-ordering-system/common-domain';
import { OrderApproval } from '../entity/OrderApproval';
export declare abstract class OrderApprovalEvent implements DomainEvent<OrderApproval> {
    _phantom?: OrderApproval;
    private readonly orderApproval;
    private readonly restaurantId;
    private readonly failureMessages;
    private readonly createdAt;
    constructor(orderApproval: OrderApproval, restaurantId: RestaurantId, failureMessages: string[], createdAt: Date);
    getOrderApproval(): OrderApproval;
    getRestaurantId(): RestaurantId;
    getFailureMessages(): string[];
    getCreatedAt(): Date;
}
//# sourceMappingURL=OrderApprovalEvent.d.ts.map