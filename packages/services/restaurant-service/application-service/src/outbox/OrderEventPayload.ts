export class OrderEventPayload {
  orderId!: string;
  restaurantId!: string;
  orderApprovalStatus!: string;
  failureMessages!: string[];
  createdAt!: Date;

  constructor(partial?: Partial<OrderEventPayload>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
