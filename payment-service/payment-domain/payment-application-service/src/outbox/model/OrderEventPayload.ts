export class OrderEventPayload {
  paymentId!: string;
  customerId!: string;
  orderId!: string;
  price!: number;
  createdAt!: Date;
  paymentStatus!: string;
  failureMessages!: string[];

  constructor() {}

  static builder(): OrderEventPayloadBuilder {
    return new OrderEventPayloadBuilder();
  }
}

class OrderEventPayloadBuilder {
  private payload: OrderEventPayload;

  constructor() {
    this.payload = new OrderEventPayload();
  }

  paymentId(paymentId: string): OrderEventPayloadBuilder {
    this.payload.paymentId = paymentId;
    return this;
  }

  customerId(customerId: string): OrderEventPayloadBuilder {
    this.payload.customerId = customerId;
    return this;
  }

  orderId(orderId: string): OrderEventPayloadBuilder {
    this.payload.orderId = orderId;
    return this;
  }

  price(price: number): OrderEventPayloadBuilder {
    this.payload.price = price;
    return this;
  }

  createdAt(createdAt: Date): OrderEventPayloadBuilder {
    this.payload.createdAt = createdAt;
    return this;
  }

  paymentStatus(paymentStatus: string): OrderEventPayloadBuilder {
    this.payload.paymentStatus = paymentStatus;
    return this;
  }

  failureMessages(failureMessages: string[]): OrderEventPayloadBuilder {
    this.payload.failureMessages = failureMessages;
    return this;
  }

  build(): OrderEventPayload {
    return this.payload;
  }
}
