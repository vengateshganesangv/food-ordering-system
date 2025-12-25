/**
 * Track Order Query
 * Query DTO for tracking an order by tracking ID
 */
export class TrackOrderQuery {
  constructor(private readonly orderTrackingId: string) {
    if (!orderTrackingId) {
      throw new Error('Order tracking ID must not be null');
    }
  }

  getOrderTrackingId(): string {
    return this.orderTrackingId;
  }

  static builder(): InstanceType<typeof TrackOrderQuery.Builder> {
    return new TrackOrderQuery.Builder();
  }

  static Builder = class {
    public _orderTrackingId?: string;

    orderTrackingId(val: string): this {
      this._orderTrackingId = val;
      return this;
    }

    build(): TrackOrderQuery {
      if (!this._orderTrackingId) {
        throw new Error('Missing required fields for TrackOrderQuery');
      }
      return new TrackOrderQuery(this._orderTrackingId);
    }
  };
}
