export class OrderEventPayload {
  constructor(
    public paymentId: string,
    public customerId: string,
    public orderId: string,
    public price: number,
    public createdAt: Date,
    public paymentStatus: string,
    public failureMessages: string[]
  ) {}
}
