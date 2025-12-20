import { IsNotEmpty, IsUUID, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import Decimal from 'decimal.js';
import { OrderItemDto } from './OrderItem';
import { OrderAddressDto } from './OrderAddress';

export class CreateOrderCommand {
  @IsNotEmpty()
  @IsUUID()
  customerId!: string;

  @IsNotEmpty()
  @IsUUID()
  restaurantId!: string;

  @IsNotEmpty()
  price!: Decimal;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => OrderAddressDto)
  address!: OrderAddressDto;
}
