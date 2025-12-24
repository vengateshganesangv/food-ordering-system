import { Money, ProductId, RestaurantId } from '@food-ordering-system/common-domain';
import { RestaurantEntity } from '@food-ordering-system/common-dataaccess';
import { Product, Restaurant } from '@food-ordering-system/order-domain-core';

export class RestaurantDataAccessMapper {
  restaurantToRestaurantProducts(restaurant: Restaurant): string[] {
    return restaurant.getProducts().map((product) => {
      const productId = product.getId();
      if (!productId) {
        throw new Error('Product ID must be set');
      }
      return productId.getValue();
    });
  }

  restaurantEntityToRestaurant(restaurantEntities: RestaurantEntity[]): Restaurant {
    if (restaurantEntities.length === 0) {
      throw new Error('Restaurant could not be found!');
    }

    const restaurantEntity = restaurantEntities[0];

    const restaurantProducts = restaurantEntities.map(
      (entity) => new Product(new ProductId(entity.productId), entity.productName, new Money(entity.productPrice)),
    );

    return Restaurant.builder()
      .restaurantId(new RestaurantId(restaurantEntity.restaurantId))
      .products(restaurantProducts)
      .active(restaurantEntity.restaurantActive)
      .build();
  }
}
