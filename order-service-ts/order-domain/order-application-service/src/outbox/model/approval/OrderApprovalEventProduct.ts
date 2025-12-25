/**
 * Order Approval Event Product
 * Product information in approval event payload
 */
export class OrderApprovalEventProduct {
  constructor(
    public id: string,
    public quantity: number,
  ) {}

  static builder(): InstanceType<typeof OrderApprovalEventProduct.Builder> {
    return new OrderApprovalEventProduct.Builder();
  }

  static Builder = class {
    public _id?: string;
    public _quantity?: number;

    id(val: string): this {
      this._id = val;
      return this;
    }

    quantity(val: number): this {
      this._quantity = val;
      return this;
    }

    build(): OrderApprovalEventProduct {
      if (!this._id || this._quantity === undefined) {
        throw new Error('Missing required fields for OrderApprovalEventProduct');
      }
      return new OrderApprovalEventProduct(this._id, this._quantity);
    }
  };
}
