import { RestaurantApprovalRequest } from './dto/RestaurantApprovalRequest';
import { RestaurantDataMapper } from './mapper/RestaurantDataMapper';
import { OrderOutboxHelper } from './outbox/scheduler/OrderOutboxHelper';
import { RestaurantApprovalResponseMessagePublisher } from './ports/output/message/publisher/RestaurantApprovalResponseMessagePublisher';
import { OrderApprovalRepository } from './ports/output/repository/OrderApprovalRepository';
import { RestaurantRepository } from './ports/output/repository/RestaurantRepository';
import { RestaurantDomainService } from '../../restaurant-domain-core/src/RestaurantDomainService';
import { Logger } from '@food-ordering-system/kafka-producer';
/**
 * Restaurant Approval Request Helper
 * Handles the business logic for restaurant approval requests
 */
export declare class RestaurantApprovalRequestHelper {
    private readonly restaurantDomainService;
    private readonly restaurantDataMapper;
    private readonly restaurantRepository;
    private readonly orderApprovalRepository;
    private readonly orderOutboxHelper;
    private readonly restaurantApprovalResponseMessagePublisher;
    private readonly logger;
    constructor(restaurantDomainService: RestaurantDomainService, restaurantDataMapper: RestaurantDataMapper, restaurantRepository: RestaurantRepository, orderApprovalRepository: OrderApprovalRepository, orderOutboxHelper: OrderOutboxHelper, restaurantApprovalResponseMessagePublisher: RestaurantApprovalResponseMessagePublisher, logger?: Logger);
    /**
     * Persist order approval with transaction management
     * Implements idempotency check via outbox pattern
     */
    persistOrderApproval(restaurantApprovalRequest: RestaurantApprovalRequest): Promise<void>;
    /**
     * Find restaurant information and enrich with product details
     */
    private findRestaurant;
    /**
     * Check if message already processed and publish if it was
     * Implements idempotency check
     */
    private publishIfOutboxMessageProcessed;
}
//# sourceMappingURL=RestaurantApprovalRequestHelper.d.ts.map