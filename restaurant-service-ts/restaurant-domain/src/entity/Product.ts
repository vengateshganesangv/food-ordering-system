import { BaseEntity, ProductId, Money } from '@food-ordering-system/common-domain';

export class Product extends BaseEntity<ProductId> {
  private name?: string;
  private price?: Money;
  private readonly quantity: number;
  private available: boolean;

  constructor(
    productId: ProductId,
    name: string | undefined,
    price: Money | undefined,
    quantity: number,
    available: boolean
  ) {
    super();
    this.setId(productId);
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.available = available;
  }

  updateWithConfirmedNamePriceAndAvailability(name: string, price: Money, available: boolean): void {
    this.name = name;
    this.price = price;
    this.available = available;
  }

  static builder(): ProductBuilder {
    return new ProductBuilder();
  }

  getName(): string | undefined {
    return this.name;
  }

  getPrice(): Money | undefined {
    return this.price;
  }

  getQuantity(): number {
    return this.quantity;
  }

  isAvailable(): boolean {
    return this.available;
  }
}

class ProductBuilder {
  private _productId?: ProductId;
  private _name?: string;
  private _price?: Money;
  private _quantity?: number;
  private _available: boolean = false;

  productId(val: ProductId): this {
    this._productId = val;
    return this;
  }

  name(val: string): this {
    this._name = val;
    return this;
  }

  price(val: Money): this {
    this._price = val;
    return this;
  }

  quantity(val: number): this {
    this._quantity = val;
    return this;
  }

  available(val: boolean): this {
    this._available = val;
    return this;
  }

  build(): Product {
    if (!this._productId || this._quantity === undefined) {
      throw new Error('Missing required fields for Product');
    }
    return new Product(this._productId, this._name, this._price, this._quantity, this._available);
  }
}
