import { RestaurantApprovalRequestMessageListener } from './ports/input/message/listener/RestaurantApprovalRequestMessageListener';
import { RestaurantApprovalRequest } from './dto/RestaurantApprovalRequest';
import { RestaurantApprovalRequestHelper } from './RestaurantApprovalRequestHelper';
import { Logger } from '@food-ordering-system/kafka-producer';
/**
 * Restaurant Approval Request Message Listener Implementation
 * Implements the input port for processing restaurant approval requests
 */
export declare class RestaurantApprovalRequestMessageListenerImpl implements RestaurantApprovalRequestMessageListener {
    private readonly restaurantApprovalRequestHelper;
    private readonly logger;
    constructor(restaurantApprovalRequestHelper: RestaurantApprovalRequestHelper, logger?: Logger);
    /**
     * Approve order - processes the restaurant approval request
     * Delegates to the helper for business logic execution
     */
    approveOrder(restaurantApprovalRequest: RestaurantApprovalRequest): Promise<void>;
}
//# sourceMappingURL=RestaurantApprovalRequestMessageListenerImpl.d.ts.map