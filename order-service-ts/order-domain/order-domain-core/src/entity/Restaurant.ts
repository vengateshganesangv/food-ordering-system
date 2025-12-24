import { AggregateRoot, RestaurantId } from '@food-ordering-system/common-domain';
import { Product } from './Product';

/**
 * Restaurant aggregate root
 * Represents a restaurant with its products
 */
export class Restaurant extends AggregateRoot<RestaurantId> {
  private readonly products: Product[];
  private active: boolean;

  constructor(restaurantId: RestaurantId, products: Product[], active: boolean) {
    super();
    this.setId(restaurantId);
    this.products = products;
    this.active = active;
  }

  static builder(): RestaurantBuilder {
    return new RestaurantBuilder();
  }

  getProducts(): Product[] {
    return this.products;
  }

  isActive(): boolean {
    return this.active;
  }
}

class RestaurantBuilder {
  public _restaurantId?: RestaurantId;
  public _products?: Product[];
  public _active: boolean = false;

  restaurantId(val: RestaurantId): this {
    this._restaurantId = val;
    return this;
  }

  products(val: Product[]): this {
    this._products = val;
    return this;
  }

  active(val: boolean): this {
    this._active = val;
    return this;
  }

  build(): Restaurant {
    if (!this._restaurantId || !this._products) {
      throw new Error('Missing required fields for Restaurant');
    }
    return new Restaurant(this._restaurantId, this._products, this._active);
  }
}
