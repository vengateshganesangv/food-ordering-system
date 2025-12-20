import { IsNotEmpty, IsUUID } from 'class-validator';

export class TrackOrderQuery {
  @IsNotEmpty()
  @IsUUID()
  orderTrackingId!: string;

  constructor(orderTrackingId: string) {
    this.orderTrackingId = orderTrackingId;
  }
}
