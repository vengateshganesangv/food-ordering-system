import { AggregateRoot, RestaurantId } from '@food-ordering-system/common-domain';
import { Product } from './Product';

interface RestaurantProps {
  restaurantId: RestaurantId;
  products: Product[];
  active: boolean;
}

export class Restaurant extends AggregateRoot<RestaurantId> {
  private readonly _products: Product[];
  private readonly _active: boolean;

  private constructor(props: RestaurantProps) {
    super();
    this.setId(props.restaurantId);
    this._products = props.products;
    this._active = props.active;
  }

  static builder(): RestaurantBuilder {
    return new RestaurantBuilder();
  }

  get products(): Product[] {
    return this._products;
  }

  get active(): boolean {
    return this._active;
  }
}

class RestaurantBuilder {
  private restaurantId?: RestaurantId;
  private products: Product[] = [];
  private active: boolean = false;

  setRestaurantId(restaurantId: RestaurantId): RestaurantBuilder {
    this.restaurantId = restaurantId;
    return this;
  }

  setProducts(products: Product[]): RestaurantBuilder {
    this.products = products;
    return this;
  }

  setActive(active: boolean): RestaurantBuilder {
    this.active = active;
    return this;
  }

  build(): Restaurant {
    if (!this.restaurantId) {
      throw new Error('RestaurantId is required');
    }
    return new Restaurant({
      restaurantId: this.restaurantId,
      products: this.products,
      active: this.active,
    });
  }
}
