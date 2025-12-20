import { BaseEntity, ProductId, Money } from '@food-ordering-system/common-domain';

interface ProductProps {
  productId?: ProductId;
  name?: string;
  price?: Money;
  quantity: number;
  available?: boolean;
}

export class Product extends BaseEntity<ProductId> {
  private _name?: string;
  private _price?: Money;
  private readonly _quantity: number;
  private _available?: boolean;

  private constructor(props: ProductProps) {
    super();
    if (props.productId) {
      this.setId(props.productId);
    }
    this._name = props.name;
    this._price = props.price;
    this._quantity = props.quantity;
    this._available = props.available;
  }

  static builder(): ProductBuilder {
    return new ProductBuilder();
  }

  updateWithConfirmedNamePriceAndAvailability(name: string, price: Money, available: boolean): void {
    this._name = name;
    this._price = price;
    this._available = available;
  }

  get name(): string | undefined {
    return this._name;
  }

  get price(): Money | undefined {
    return this._price;
  }

  get quantity(): number {
    return this._quantity;
  }

  get available(): boolean | undefined {
    return this._available;
  }

  isAvailable(): boolean {
    return this._available || false;
  }
}

class ProductBuilder {
  private productId?: ProductId;
  private name?: string;
  private price?: Money;
  private quantity: number = 0;
  private available?: boolean;

  setProductId(productId: ProductId): ProductBuilder {
    this.productId = productId;
    return this;
  }

  setName(name: string): ProductBuilder {
    this.name = name;
    return this;
  }

  setPrice(price: Money): ProductBuilder {
    this.price = price;
    return this;
  }

  setQuantity(quantity: number): ProductBuilder {
    this.quantity = quantity;
    return this;
  }

  setAvailable(available: boolean): ProductBuilder {
    this.available = available;
    return this;
  }

  build(): Product {
    return new Product({
      productId: this.productId,
      name: this.name,
      price: this.price,
      quantity: this.quantity,
      available: this.available,
    });
  }
}
