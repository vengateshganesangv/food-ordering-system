import { Restaurant } from '@food-ordering-system/order-domain-core';

/**
 * Restaurant Repository interface
 * Output port for restaurant persistence
 */
export interface RestaurantRepository {
  /**
   * Finds restaurant information including products
   * @param restaurant Restaurant with ID and products to look up
   * @returns Restaurant with full product information if found
   */
  findRestaurantInformation(restaurant: Restaurant): Promise<Restaurant | undefined>;
}
