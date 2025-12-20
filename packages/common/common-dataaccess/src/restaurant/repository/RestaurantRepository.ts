import { Repository } from 'typeorm';
import { RestaurantEntity } from '../entity/RestaurantEntity';

export interface RestaurantRepository extends Repository<RestaurantEntity> {
  findByRestaurantIdAndProductIdIn(
    restaurantId: string,
    productIds: string[],
  ): Promise<RestaurantEntity[]>;
}
