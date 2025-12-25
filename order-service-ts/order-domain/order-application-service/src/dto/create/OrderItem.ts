/**
 * Order Item DTO
 * Represents an item in the order
 */
export class OrderItem {
  constructor(
    private readonly productId: string,
    private readonly quantity: number,
    private readonly price: number,
    private readonly subTotal: number,
  ) {
    if (!productId) {
      throw new Error('Product ID must not be null');
    }
    if (!quantity) {
      throw new Error('Quantity must not be null');
    }
    if (price === undefined || price === null) {
      throw new Error('Price must not be null');
    }
    if (subTotal === undefined || subTotal === null) {
      throw new Error('SubTotal must not be null');
    }
  }

  getProductId(): string {
    return this.productId;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getPrice(): number {
    return this.price;
  }

  getSubTotal(): number {
    return this.subTotal;
  }

  static builder(): InstanceType<typeof OrderItem.Builder> {
    return new OrderItem.Builder();
  }

  static Builder = class {
    public _productId?: string;
    public _quantity?: number;
    public _price?: number;
    public _subTotal?: number;

    productId(val: string): this {
      this._productId = val;
      return this;
    }

    quantity(val: number): this {
      this._quantity = val;
      return this;
    }

    price(val: number): this {
      this._price = val;
      return this;
    }

    subTotal(val: number): this {
      this._subTotal = val;
      return this;
    }

    build(): OrderItem {
      if (
        !this._productId ||
        this._quantity === undefined ||
        this._price === undefined ||
        this._subTotal === undefined
      ) {
        throw new Error('Missing required fields for OrderItem');
      }
      return new OrderItem(this._productId, this._quantity, this._price, this._subTotal);
    }
  };
}
