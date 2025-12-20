import { AggregateRoot, RestaurantId, ProductId } from '@food-ordering/common-domain';

export class Restaurant extends AggregateRoot<RestaurantId> {
  constructor(
    restaurantId: RestaurantId,
    private readonly name: string,
    private readonly active: boolean,
    private readonly products: ProductId[],
  ) {
    super();
    this.setId(restaurantId);
  }

  getName(): string {
    return this.name;
  }

  isActive(): boolean {
    return this.active;
  }

  getProducts(): ProductId[] {
    return this.products;
  }
}
