import { IsNotEmpty, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '@food-ordering-system/common-domain';

export class TrackOrderResponse {
  @IsNotEmpty()
  @IsUUID()
  orderTrackingId!: string;

  @IsNotEmpty()
  @IsEnum(OrderStatus)
  orderStatus!: OrderStatus;

  @IsOptional()
  failureMessages?: string[];

  constructor(orderTrackingId: string, orderStatus: OrderStatus, failureMessages?: string[]) {
    this.orderTrackingId = orderTrackingId;
    this.orderStatus = orderStatus;
    this.failureMessages = failureMessages;
  }
}
