import { OrderStatus } from '@food-ordering-system/common-domain';

/**
 * Create Order Response
 * Response DTO for order creation
 */
export class CreateOrderResponse {
  constructor(
    private readonly orderTrackingId: string,
    private readonly orderStatus: OrderStatus,
    private readonly message: string,
  ) {
    if (!orderTrackingId) {
      throw new Error('Order tracking ID must not be null');
    }
    if (!orderStatus) {
      throw new Error('Order status must not be null');
    }
    if (!message) {
      throw new Error('Message must not be null');
    }
  }

  getOrderTrackingId(): string {
    return this.orderTrackingId;
  }

  getOrderStatus(): OrderStatus {
    return this.orderStatus;
  }

  getMessage(): string {
    return this.message;
  }

  static builder(): InstanceType<typeof CreateOrderResponse.Builder> {
    return new CreateOrderResponse.Builder();
  }

  static Builder = class {
    public _orderTrackingId?: string;
    public _orderStatus?: OrderStatus;
    public _message?: string;

    orderTrackingId(val: string): this {
      this._orderTrackingId = val;
      return this;
    }

    orderStatus(val: OrderStatus): this {
      this._orderStatus = val;
      return this;
    }

    message(val: string): this {
      this._message = val;
      return this;
    }

    build(): CreateOrderResponse {
      if (!this._orderTrackingId || !this._orderStatus || !this._message) {
        throw new Error('Missing required fields for CreateOrderResponse');
      }
      return new CreateOrderResponse(this._orderTrackingId, this._orderStatus, this._message);
    }
  };
}
