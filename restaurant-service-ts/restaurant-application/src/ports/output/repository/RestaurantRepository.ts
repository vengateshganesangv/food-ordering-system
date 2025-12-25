import { Restaurant } from '@food-ordering-system/restaurant-domain-core';

/**
 * Restaurant Repository (Output Port)
 * Interface for querying restaurant information
 */
export interface RestaurantRepository {
  /**
   * Find restaurant information with products
   * @param restaurant Restaurant entity with search criteria
   * @returns Restaurant with detailed information if found
   */
  findRestaurantInformation(restaurant: Restaurant): Promise<Restaurant | undefined>;
}
