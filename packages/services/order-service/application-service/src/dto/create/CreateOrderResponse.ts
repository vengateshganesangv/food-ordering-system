import { IsNotEmpty, IsUUID, IsEnum } from 'class-validator';
import { OrderStatus } from '@food-ordering-system/common-domain';

export class CreateOrderResponse {
  @IsNotEmpty()
  @IsUUID()
  orderTrackingId!: string;

  @IsNotEmpty()
  @IsEnum(OrderStatus)
  orderStatus!: OrderStatus;

  @IsNotEmpty()
  message!: string;

  constructor(orderTrackingId: string, orderStatus: OrderStatus, message: string) {
    this.orderTrackingId = orderTrackingId;
    this.orderStatus = orderStatus;
    this.message = message;
  }
}
