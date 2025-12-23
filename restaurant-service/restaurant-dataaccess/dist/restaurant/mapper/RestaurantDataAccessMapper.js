"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantDataAccessMapper = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
const restaurant_domain_core_1 = require("@food-ordering-system/restaurant-domain-core");
const restaurant_domain_core_2 = require("@food-ordering-system/restaurant-domain-core");
const OrderApprovalEntity_1 = require("../entity/OrderApprovalEntity");
/**
 * Restaurant Data Access Mapper
 * Maps between domain entities and TypeORM data access entities
 */
class RestaurantDataAccessMapper {
    /**
     * Extract product IDs from restaurant for querying
     * @param restaurant Domain restaurant entity
     * @returns List of product UUIDs
     */
    restaurantToRestaurantProducts(restaurant) {
        return restaurant
            .getOrderDetail()
            .getProducts()
            .map((product) => product.getId().getValue());
    }
    /**
     * Convert list of RestaurantEntity to domain Restaurant
     * @param restaurantEntities List of restaurant entities from database
     * @returns Domain restaurant entity
     * @throws Error if no restaurants found
     */
    restaurantEntityToRestaurant(restaurantEntities) {
        if (restaurantEntities.length === 0) {
            throw new Error('No restaurants found!');
        }
        const restaurantEntity = restaurantEntities[0];
        const restaurantProducts = restaurantEntities.map((entity) => restaurant_domain_core_1.Product.builder()
            .productId(new common_domain_1.ProductId(entity.productId))
            .name(entity.productName)
            .price(new common_domain_1.Money(entity.productPrice))
            .available(entity.productAvailable)
            .build());
        return restaurant_domain_core_1.Restaurant.builder()
            .restaurantId(new common_domain_1.RestaurantId(restaurantEntity.restaurantId))
            .orderDetail(restaurant_domain_core_1.OrderDetail.builder()
            .products(restaurantProducts)
            .build())
            .active(restaurantEntity.restaurantActive)
            .build();
    }
    /**
     * Convert domain OrderApproval to OrderApprovalEntity
     * @param orderApproval Domain order approval
     * @returns TypeORM entity
     */
    orderApprovalToOrderApprovalEntity(orderApproval) {
        const entity = new OrderApprovalEntity_1.OrderApprovalEntity();
        entity.id = orderApproval.getId().getValue();
        entity.restaurantId = orderApproval.getRestaurantId().getValue();
        entity.orderId = orderApproval.getOrderId().getValue();
        entity.status = orderApproval.getApprovalStatus();
        return entity;
    }
    /**
     * Convert OrderApprovalEntity to domain OrderApproval
     * @param orderApprovalEntity TypeORM entity
     * @returns Domain order approval
     */
    orderApprovalEntityToOrderApproval(orderApprovalEntity) {
        return restaurant_domain_core_1.OrderApproval.builder()
            .orderApprovalId(new restaurant_domain_core_2.OrderApprovalId(orderApprovalEntity.id))
            .restaurantId(new common_domain_1.RestaurantId(orderApprovalEntity.restaurantId))
            .orderId(new common_domain_1.OrderId(orderApprovalEntity.orderId))
            .approvalStatus(orderApprovalEntity.status)
            .build();
    }
}
exports.RestaurantDataAccessMapper = RestaurantDataAccessMapper;
