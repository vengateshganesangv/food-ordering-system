import { Repository } from 'typeorm';
import { RestaurantEntity } from '@food-ordering-system/common-dataaccess';
import { Restaurant } from '@food-ordering-system/restaurant-domain-core';
import { RestaurantRepository } from '@food-ordering-system/restaurant-application-service';
import { RestaurantDataAccessMapper } from '../mapper/RestaurantDataAccessMapper';
/**
 * Restaurant Repository Implementation
 * Adapter that implements the RestaurantRepository output port
 * Uses TypeORM and common-dataaccess RestaurantEntity
 */
export declare class RestaurantRepositoryImpl implements RestaurantRepository {
    private readonly restaurantJpaRepository;
    private readonly restaurantDataAccessMapper;
    constructor(restaurantJpaRepository: Repository<RestaurantEntity>, restaurantDataAccessMapper: RestaurantDataAccessMapper);
    /**
     * Find restaurant information including products
     * @param restaurant Domain restaurant entity with product IDs to query
     * @returns Restaurant with product details, or undefined if not found
     */
    findRestaurantInformation(restaurant: Restaurant): Promise<Restaurant | undefined>;
}
