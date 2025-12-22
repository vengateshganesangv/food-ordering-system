import { Repository, DataSource } from 'typeorm';
import { RestaurantEntity } from '../entity/RestaurantEntity';
/**
 * Restaurant JPA Repository
 * Provides data access methods for RestaurantEntity
 */
export declare class RestaurantJpaRepository extends Repository<RestaurantEntity> {
    constructor(dataSource: DataSource);
    /**
     * Finds restaurant entities by restaurantId and a list of productIds
     * @param restaurantId - The restaurant UUID
     * @param productIds - List of product UUIDs
     * @returns Promise resolving to array of RestaurantEntity or undefined
     */
    findByRestaurantIdAndProductIdIn(restaurantId: string, productIds: string[]): Promise<RestaurantEntity[] | undefined>;
}
/**
 * Creates a RestaurantJpaRepository instance
 * @param dataSource - TypeORM DataSource instance
 * @returns RestaurantJpaRepository instance
 */
export declare function createRestaurantJpaRepository(dataSource: DataSource): RestaurantJpaRepository;
//# sourceMappingURL=RestaurantJpaRepository.d.ts.map