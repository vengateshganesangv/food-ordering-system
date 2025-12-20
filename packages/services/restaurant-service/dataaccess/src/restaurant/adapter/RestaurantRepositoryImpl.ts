import { injectable } from 'tsyringe';
import { DataSource } from 'typeorm';
import { Restaurant, Product } from '@food-ordering-system/restaurant-domain-core';
import { RestaurantRepository } from '@food-ordering-system/restaurant-application-service';
import { RestaurantId, ProductId, Money } from '@food-ordering-system/common-domain';

@injectable()
export class RestaurantRepositoryImpl implements RestaurantRepository {
  constructor(private dataSource: DataSource) {}

  async findRestaurantInformation(restaurant: Restaurant): Promise<Restaurant | null> {
    // In a real implementation, this would query the database for restaurant and product information
    // For now, return the restaurant with updated product information
    const products = restaurant.orderDetail.products.map((product) =>
      Product.builder()
        .setProductId(product.getId()!)
        .setName(`Product ${product.getId()!.getValue()}`)
        .setPrice(new Money(10.0))
        .setQuantity(product.quantity)
        .setAvailable(true)
        .build()
    );

    return Restaurant.builder()
      .setRestaurantId(restaurant.getId()!)
      .setOrderDetail(restaurant.orderDetail)
      .setActive(true)
      .build();
  }
}
