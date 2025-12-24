import { RestaurantJpaRepository } from '@food-ordering-system/common-dataaccess';
import { Restaurant } from '@food-ordering-system/order-domain-core';
import { RestaurantRepository } from '@food-ordering-system/order-application-service';
import { RestaurantDataAccessMapper } from '../mapper/RestaurantDataAccessMapper';

export class RestaurantRepositoryImpl implements RestaurantRepository {
  constructor(
    private readonly restaurantJpaRepository: RestaurantJpaRepository,
    private readonly restaurantDataAccessMapper: RestaurantDataAccessMapper,
  ) {}

  async findRestaurantInformation(restaurant: Restaurant): Promise<Restaurant | undefined> {
    const restaurantId = restaurant.getId();
    if (!restaurantId) {
      throw new Error('Restaurant ID must be set');
    }

    const restaurantProducts = this.restaurantDataAccessMapper.restaurantToRestaurantProducts(restaurant);
    const restaurantEntities = await this.restaurantJpaRepository.findByRestaurantIdAndProductIdIn(
      restaurantId.getValue(),
      restaurantProducts,
    );

    return restaurantEntities && restaurantEntities.length > 0
      ? this.restaurantDataAccessMapper.restaurantEntityToRestaurant(restaurantEntities)
      : undefined;
  }
}
