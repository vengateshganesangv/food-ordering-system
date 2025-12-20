import { BaseEntity, ProductId, Money } from '@food-ordering/common-domain';

export class OrderItem extends BaseEntity<number> {
  constructor(
    private readonly productId: ProductId,
    private readonly quantity: number,
    private readonly price: Money,
    private readonly subTotal: Money,
  ) {
    super();
  }

  getProductId(): ProductId {
    return this.productId;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getPrice(): Money {
    return this.price;
  }

  getSubTotal(): Money {
    return this.subTotal;
  }
}
