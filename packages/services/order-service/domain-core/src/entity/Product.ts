import { BaseEntity, ProductId, Money } from '@food-ordering-system/common-domain';

export class Product extends BaseEntity<ProductId> {
  private _name?: string;
  private _price?: Money;

  constructor(productId: ProductId, name?: string, price?: Money) {
    super();
    this.setId(productId);
    this._name = name;
    this._price = price;
  }

  updateWithConfirmedNameAndPrice(name: string, price: Money): void {
    this._name = name;
    this._price = price;
  }

  get name(): string | undefined {
    return this._name;
  }

  get price(): Money | undefined {
    return this._price;
  }
}
