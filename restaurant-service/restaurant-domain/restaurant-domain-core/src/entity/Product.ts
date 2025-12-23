import { BaseEntity, ProductId, Money } from '@food-ordering-system/common-domain';

export class Product extends BaseEntity<ProductId> {
  private name?: string;
  private price?: Money;
  private readonly quantity: number;
  private available: boolean;

  private constructor(
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
  private productId?: ProductId;
  private name?: string;
  private price?: Money;
  private quantity?: number;
  private available: boolean = false;

  productId(val: ProductId): this {
    this.productId = val;
    return this;
  }

  name(val: string): this {
    this.name = val;
    return this;
  }

  price(val: Money): this {
    this.price = val;
    return this;
  }

  quantity(val: number): this {
    this.quantity = val;
    return this;
  }

  available(val: boolean): this {
    this.available = val;
    return this;
  }

  build(): Product {
    if (!this.productId || this.quantity === undefined) {
      throw new Error('Missing required fields for Product');
    }
    return new Product(this.productId, this.name, this.price, this.quantity, this.available);
  }
}
