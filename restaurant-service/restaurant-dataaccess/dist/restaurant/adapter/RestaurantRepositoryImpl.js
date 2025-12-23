"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantRepositoryImpl = void 0;
/**
 * Restaurant Repository Implementation
 * Adapter that implements the RestaurantRepository output port
 * Uses TypeORM and common-dataaccess RestaurantEntity
 */
class RestaurantRepositoryImpl {
    constructor(restaurantJpaRepository, restaurantDataAccessMapper) {
        this.restaurantJpaRepository = restaurantJpaRepository;
        this.restaurantDataAccessMapper = restaurantDataAccessMapper;
    }
    /**
     * Find restaurant information including products
     * @param restaurant Domain restaurant entity with product IDs to query
     * @returns Restaurant with product details, or undefined if not found
     */
    async findRestaurantInformation(restaurant) {
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
exports.RestaurantRepositoryImpl = RestaurantRepositoryImpl;
