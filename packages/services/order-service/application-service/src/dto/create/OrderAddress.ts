import { IsNotEmpty, MaxLength } from 'class-validator';

export class OrderAddressDto {
  @IsNotEmpty()
  @MaxLength(50)
  street!: string;

  @IsNotEmpty()
  @MaxLength(10)
  postalCode!: string;

  @IsNotEmpty()
  @MaxLength(50)
  city!: string;
}
