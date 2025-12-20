export class OrderEventPayload {
  paymentId!: string;
  customerId!: string;
  orderId!: string;
  price!: number;
  createdAt!: Date;
  paymentStatus!: string;
  failureMessages!: string[];

  constructor(partial?: Partial<OrderEventPayload>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
