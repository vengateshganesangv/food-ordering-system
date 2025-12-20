import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';
import Decimal from 'decimal.js';

export class OrderItemDto {
  @IsNotEmpty()
  @IsUUID()
  productId!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsNotEmpty()
  price!: Decimal;

  @IsNotEmpty()
  subTotal!: Decimal;
}
