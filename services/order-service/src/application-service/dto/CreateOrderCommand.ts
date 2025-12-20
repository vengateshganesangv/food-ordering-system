export interface OrderItemDto {
  productId: string;
  quantity: number;
  price: number;
}

export class CreateOrderCommand {
  constructor(
    public readonly customerId: string,
    public readonly restaurantId: string,
    public readonly items: OrderItemDto[],
    public readonly price: number,
  ) {}
}
