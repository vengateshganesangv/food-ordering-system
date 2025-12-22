import { Repository, DataSource, In } from 'typeorm';
import { RestaurantEntity } from '../entity/RestaurantEntity';

/**
 * Restaurant JPA Repository
 * Provides data access methods for RestaurantEntity
 */
export class RestaurantJpaRepository extends Repository<RestaurantEntity> {
  constructor(dataSource: DataSource) {
    super(RestaurantEntity, dataSource.createEntityManager());
  }

  /**
   * Finds restaurant entities by restaurantId and a list of productIds
   * @param restaurantId - The restaurant UUID
   * @param productIds - List of product UUIDs
   * @returns Promise resolving to array of RestaurantEntity or undefined
   */
  async findByRestaurantIdAndProductIdIn(
    restaurantId: string,
    productIds: string[]
  ): Promise<RestaurantEntity[] | undefined> {
    if (!productIds || productIds.length === 0) {
      return undefined;
    }

    const results = await this.find({
      where: {
        restaurantId,
        productId: In(productIds)
      }
    });

    return results.length > 0 ? results : undefined;
  }
}

/**
 * Creates a RestaurantJpaRepository instance
 * @param dataSource - TypeORM DataSource instance
 * @returns RestaurantJpaRepository instance
 */
export function createRestaurantJpaRepository(dataSource: DataSource): RestaurantJpaRepository {
  return new RestaurantJpaRepository(dataSource);
}
