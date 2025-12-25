import { OrderApprovalEventProduct } from './OrderApprovalEventProduct';

/**
 * Order Approval Event Payload
 * Payload for approval outbox messages
 */
export class OrderApprovalEventPayload {
  constructor(
    public orderId: string,
    public restaurantId: string,
    public price: number,
    public createdAt: Date,
    public restaurantOrderStatus: string,
    public products: OrderApprovalEventProduct[],
  ) {}

  static builder(): InstanceType<typeof OrderApprovalEventPayload.Builder> {
    return new OrderApprovalEventPayload.Builder();
  }

  static Builder = class {
    public _orderId?: string;
    public _restaurantId?: string;
    public _price?: number;
    public _createdAt?: Date;
    public _restaurantOrderStatus?: string;
    public _products?: OrderApprovalEventProduct[];

    orderId(val: string): this {
      this._orderId = val;
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

    createdAt(val: Date): this {
      this._createdAt = val;
      return this;
    }

    restaurantOrderStatus(val: string): this {
      this._restaurantOrderStatus = val;
      return this;
    }

    products(val: OrderApprovalEventProduct[]): this {
      this._products = val;
      return this;
    }

    build(): OrderApprovalEventPayload {
      if (
        !this._orderId ||
        !this._restaurantId ||
        this._price === undefined ||
        !this._createdAt ||
        !this._restaurantOrderStatus ||
        !this._products
      ) {
        throw new Error('Missing required fields for OrderApprovalEventPayload');
      }
      return new OrderApprovalEventPayload(
        this._orderId,
        this._restaurantId,
        this._price,
        this._createdAt,
        this._restaurantOrderStatus,
        this._products,
      );
    }
  };
}
