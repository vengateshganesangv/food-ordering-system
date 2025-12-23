import { RestaurantApprovalRequest } from '../dto/RestaurantApprovalRequest';
import { Restaurant } from '../../../restaurant-domain-core/src/entity/Restaurant';
import { OrderApprovalEvent } from '../../../restaurant-domain-core/src/event/OrderApprovalEvent';
import { OrderEventPayload } from '../outbox/model/OrderEventPayload';
/**
 * Restaurant Data Mapper
 * Maps between DTOs, domain entities, and outbox messages
 */
export declare class RestaurantDataMapper {
    /**
     * Convert RestaurantApprovalRequest DTO to Restaurant domain entity
     */
    restaurantApprovalRequestToRestaurant(restaurantApprovalRequest: RestaurantApprovalRequest): Restaurant;
    /**
     * Convert OrderApprovalEvent to OrderEventPayload for outbox
     */
    orderApprovalEventToOrderEventPayload(orderApprovalEvent: OrderApprovalEvent): OrderEventPayload;
}
//# sourceMappingURL=RestaurantDataMapper.d.ts.map