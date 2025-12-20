import { Restaurant } from '@food-ordering-system/order-domain-core';

export interface RestaurantRepository {
  findRestaurantInformation(restaurant: Restaurant): Promise<Restaurant | null>;
}
