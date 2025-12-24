/**
 * Order Payment Event Payload
 * Payload for payment outbox messages
 */
export class OrderPaymentEventPayload {
  constructor(
    public orderId: string,
    public customerId: string,
    public price: number,
    public createdAt: Date,
    public paymentOrderStatus: string,
  ) {}

  static builder(): OrderPaymentEventPayloadBuilder {
    return new OrderPaymentEventPayloadBuilder();
  }

  static Builder = class OrderPaymentEventPayloadBuilder {
    public _orderId?: string;
    public _customerId?: string;
    public _price?: number;
    public _createdAt?: Date;
    public _paymentOrderStatus?: string;

    orderId(val: string): this {
      this._orderId = val;
      return this;
    }

    customerId(val: string): this {
      this._customerId = val;
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

    paymentOrderStatus(val: string): this {
      this._paymentOrderStatus = val;
      return this;
    }

    build(): OrderPaymentEventPayload {
      if (
        !this._orderId ||
        !this._customerId ||
        this._price === undefined ||
        !this._createdAt ||
        !this._paymentOrderStatus
      ) {
        throw new Error('Missing required fields for OrderPaymentEventPayload');
      }
      return new OrderPaymentEventPayload(
        this._orderId,
        this._customerId,
        this._price,
        this._createdAt,
        this._paymentOrderStatus,
      );
    }
  };
}
