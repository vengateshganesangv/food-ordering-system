import { Restaurant } from '@food-ordering-system/restaurant-domain-core';

export interface RestaurantRepository {
  findRestaurantInformation(restaurant: Restaurant): Promise<Restaurant | null>;
}
