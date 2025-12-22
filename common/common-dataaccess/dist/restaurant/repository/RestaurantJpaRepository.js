"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantJpaRepository = void 0;
exports.createRestaurantJpaRepository = createRestaurantJpaRepository;
const typeorm_1 = require("typeorm");
const RestaurantEntity_1 = require("../entity/RestaurantEntity");
/**
 * Restaurant JPA Repository
 * Provides data access methods for RestaurantEntity
 */
class RestaurantJpaRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(RestaurantEntity_1.RestaurantEntity, dataSource.createEntityManager());
    }
    /**
     * Finds restaurant entities by restaurantId and a list of productIds
     * @param restaurantId - The restaurant UUID
     * @param productIds - List of product UUIDs
     * @returns Promise resolving to array of RestaurantEntity or undefined
     */
    async findByRestaurantIdAndProductIdIn(restaurantId, productIds) {
        if (!productIds || productIds.length === 0) {
            return undefined;
        }
        const results = await this.find({
            where: {
                restaurantId,
                productId: (0, typeorm_1.In)(productIds)
            }
        });
        return results.length > 0 ? results : undefined;
    }
}
exports.RestaurantJpaRepository = RestaurantJpaRepository;
/**
 * Creates a RestaurantJpaRepository instance
 * @param dataSource - TypeORM DataSource instance
 * @returns RestaurantJpaRepository instance
 */
function createRestaurantJpaRepository(dataSource) {
    return new RestaurantJpaRepository(dataSource);
}
//# sourceMappingURL=RestaurantJpaRepository.js.map