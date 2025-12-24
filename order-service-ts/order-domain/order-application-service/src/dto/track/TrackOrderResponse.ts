import { OrderStatus } from '@food-ordering-system/common-domain';

/**
 * Track Order Response
 * Response DTO for order tracking
 */
export class TrackOrderResponse {
  constructor(
    private readonly orderTrackingId: string,
    private readonly orderStatus: OrderStatus,
    private readonly failureMessages?: string[],
  ) {
    if (!orderTrackingId) {
      throw new Error('Order tracking ID must not be null');
    }
    if (!orderStatus) {
      throw new Error('Order status must not be null');
    }
  }

  getOrderTrackingId(): string {
    return this.orderTrackingId;
  }

  getOrderStatus(): OrderStatus {
    return this.orderStatus;
  }

  getFailureMessages(): string[] | undefined {
    return this.failureMessages;
  }

  static builder(): TrackOrderResponseBuilder {
    return new TrackOrderResponseBuilder();
  }

  static Builder = class TrackOrderResponseBuilder {
    public _orderTrackingId?: string;
    public _orderStatus?: OrderStatus;
    public _failureMessages?: string[];

    orderTrackingId(val: string): this {
      this._orderTrackingId = val;
      return this;
    }

    orderStatus(val: OrderStatus): this {
      this._orderStatus = val;
      return this;
    }

    failureMessages(val: string[]): this {
      this._failureMessages = val;
      return this;
    }

    build(): TrackOrderResponse {
      if (!this._orderTrackingId || !this._orderStatus) {
        throw new Error('Missing required fields for TrackOrderResponse');
      }
      return new TrackOrderResponse(this._orderTrackingId, this._orderStatus, this._failureMessages);
    }
  };
}
