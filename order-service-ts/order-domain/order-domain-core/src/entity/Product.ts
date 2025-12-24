import { BaseEntity, Money, ProductId } from '@food-ordering-system/common-domain';

/**
 * Product entity
 * Represents a product in an order
 */
export class Product extends BaseEntity<ProductId> {
  private name?: string;
  private price?: Money;

  constructor(productId: ProductId, name?: string, price?: Money) {
    super();
    this.setId(productId);
    this.name = name;
    this.price = price;
  }

  updateWithConfirmedNameAndPrice(name: string, price: Money): void {
    this.name = name;
    this.price = price;
  }

  getName(): string | undefined {
    return this.name;
  }

  getPrice(): Money | undefined {
    return this.price;
  }
}
