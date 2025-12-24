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
export class RestaurantRepositoryImpl implements RestaurantRepository {
  constructor(
    private readonly restaurantJpaRepository: Repository<RestaurantEntity>,
    private readonly restaurantDataAccessMapper: RestaurantDataAccessMapper,
  ) {}

  /**
   * Find restaurant information including products
   * @param restaurant Domain restaurant entity with product IDs to query
   * @returns Restaurant with product details, or undefined if not found
   */
  async findRestaurantInformation(restaurant: Restaurant): Promise<Restaurant | undefined> {
    const restaurantProducts = this.restaurantDataAccessMapper.restaurantToRestaurantProducts(restaurant);
    const restaurantId = restaurant.getId();

    if (!restaurantId) {
      return undefined;
    }

    const restaurantEntities = await this.restaurantJpaRepository
      .createQueryBuilder('restaurant')
      .where('restaurant.restaurantId = :restaurantId', {
        restaurantId: restaurantId.getValue(),
      })
      .andWhere('restaurant.productId IN (:...productIds)', {
        productIds: restaurantProducts,
      })
      .getMany();

    if (restaurantEntities.length === 0) {
      return undefined;
    }

    return this.restaurantDataAccessMapper.restaurantEntityToRestaurant(restaurantEntities);
  }
}
