import { RestaurantEntity } from '@food-ordering-system/common-dataaccess';
import { OrderApproval, Restaurant } from '@food-ordering-system/restaurant-domain-core';
import { OrderApprovalEntity } from '../entity/OrderApprovalEntity';
/**
 * Restaurant Data Access Mapper
 * Maps between domain entities and TypeORM data access entities
 */
export declare class RestaurantDataAccessMapper {
    /**
     * Extract product IDs from restaurant for querying
     * @param restaurant Domain restaurant entity
     * @returns List of product UUIDs
     */
    restaurantToRestaurantProducts(restaurant: Restaurant): string[];
    /**
     * Convert list of RestaurantEntity to domain Restaurant
     * @param restaurantEntities List of restaurant entities from database
     * @returns Domain restaurant entity
     * @throws Error if no restaurants found
     */
    restaurantEntityToRestaurant(restaurantEntities: RestaurantEntity[]): Restaurant;
    /**
     * Convert domain OrderApproval to OrderApprovalEntity
     * @param orderApproval Domain order approval
     * @returns TypeORM entity
     */
    orderApprovalToOrderApprovalEntity(orderApproval: OrderApproval): OrderApprovalEntity;
    /**
     * Convert OrderApprovalEntity to domain OrderApproval
     * @param orderApprovalEntity TypeORM entity
     * @returns Domain order approval
     */
    orderApprovalEntityToOrderApproval(orderApprovalEntity: OrderApprovalEntity): OrderApproval;
}
