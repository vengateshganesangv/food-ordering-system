export class CreateOrderResponse {
  constructor(
    public readonly orderId: string,
    public readonly orderStatus: string,
    public readonly message: string,
  ) {}
}
