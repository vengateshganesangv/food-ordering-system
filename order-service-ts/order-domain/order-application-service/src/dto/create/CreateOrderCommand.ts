import { OrderAddress } from './OrderAddress';
import { OrderItem } from './OrderItem';

/**
 * Create Order Command
 * Command DTO for creating a new order
 */
export class CreateOrderCommand {
  constructor(
    private readonly customerId: string,
    private readonly restaurantId: string,
    private readonly price: number,
    private readonly items: OrderItem[],
    private readonly address: OrderAddress,
  ) {
    if (!customerId) {
      throw new Error('Customer ID must not be null');
    }
    if (!restaurantId) {
      throw new Error('Restaurant ID must not be null');
    }
    if (price === undefined || price === null) {
      throw new Error('Price must not be null');
    }
    if (!items || items.length === 0) {
      throw new Error('Items must not be null or empty');
    }
    if (!address) {
      throw new Error('Address must not be null');
    }
  }

  getCustomerId(): string {
    return this.customerId;
  }

  getRestaurantId(): string {
    return this.restaurantId;
  }

  getPrice(): number {
    return this.price;
  }

  getItems(): OrderItem[] {
    return this.items;
  }

  getAddress(): OrderAddress {
    return this.address;
  }

  static builder(): CreateOrderCommandBuilder {
    return new CreateOrderCommandBuilder();
  }

  static Builder = class CreateOrderCommandBuilder {
    public _customerId?: string;
    public _restaurantId?: string;
    public _price?: number;
    public _items?: OrderItem[];
    public _address?: OrderAddress;

    customerId(val: string): this {
      this._customerId = val;
      return this;
    }

    restaurantId(val: string): this {
      this._restaurantId = val;
      return this;
    }

    price(val: number): this {
      this._price = val;
      return this;
    }

    items(val: OrderItem[]): this {
      this._items = val;
      return this;
    }

    address(val: OrderAddress): this {
      this._address = val;
      return this;
    }

    build(): CreateOrderCommand {
      if (
        !this._customerId ||
        !this._restaurantId ||
        this._price === undefined ||
        !this._items ||
        !this._address
      ) {
        throw new Error('Missing required fields for CreateOrderCommand');
      }
      return new CreateOrderCommand(
        this._customerId,
        this._restaurantId,
        this._price,
        this._items,
        this._address,
      );
    }
  };
}
