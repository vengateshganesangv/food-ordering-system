import { RestaurantEntity } from '@food-ordering-system/common-dataaccess';
import { Money, OrderId, ProductId, RestaurantId } from '@food-ordering-system/common-domain';
import { OrderApproval, OrderDetail, Product, Restaurant } from '@food-ordering-system/restaurant-domain-core';
import { OrderApprovalId } from '@food-ordering-system/restaurant-domain-core';
import { OrderApprovalEntity } from '../entity/OrderApprovalEntity';

/**
 * Restaurant Data Access Mapper
 * Maps between domain entities and TypeORM data access entities
 */
export class RestaurantDataAccessMapper {
  /**
   * Extract product IDs from restaurant for querying
   * @param restaurant Domain restaurant entity
   * @returns List of product UUIDs
   */
  restaurantToRestaurantProducts(restaurant: Restaurant): string[] {
    return restaurant
      .getOrderDetail()
      .getProducts()
      .map((product) => product.getId()!.getValue());
  }

  /**
   * Convert list of RestaurantEntity to domain Restaurant
   * @param restaurantEntities List of restaurant entities from database
   * @returns Domain restaurant entity
   * @throws Error if no restaurants found
   */
  restaurantEntityToRestaurant(restaurantEntities: RestaurantEntity[]): Restaurant {
    if (restaurantEntities.length === 0) {
      throw new Error('No restaurants found!');
    }

    const restaurantEntity = restaurantEntities[0];

    const restaurantProducts: Product[] = restaurantEntities.map((entity) =>
      Product.builder()
        .productId(new ProductId(entity.productId))
        .name(entity.productName)
        .price(new Money(entity.productPrice))
        .available(entity.productAvailable)
        .build(),
    );

    return Restaurant.builder()
      .restaurantId(new RestaurantId(restaurantEntity.restaurantId))
      .orderDetail(
        OrderDetail.builder()
          .products(restaurantProducts)
          .build(),
      )
      .active(restaurantEntity.restaurantActive)
      .build();
  }

  /**
   * Convert domain OrderApproval to OrderApprovalEntity
   * @param orderApproval Domain order approval
   * @returns TypeORM entity
   */
  orderApprovalToOrderApprovalEntity(orderApproval: OrderApproval): OrderApprovalEntity {
    const entity = new OrderApprovalEntity();
    entity.id = orderApproval.getId()!.getValue();
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
  orderApprovalEntityToOrderApproval(orderApprovalEntity: OrderApprovalEntity): OrderApproval {
    return OrderApproval.builder()
      .orderApprovalId(new OrderApprovalId(orderApprovalEntity.id))
      .restaurantId(new RestaurantId(orderApprovalEntity.restaurantId))
      .orderId(new OrderId(orderApprovalEntity.orderId))
      .approvalStatus(orderApprovalEntity.status)
      .build();
  }
}
