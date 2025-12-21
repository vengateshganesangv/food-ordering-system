import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCustomerCommand {
  @IsUUID()
  @IsNotEmpty()
  customerId!: string;

  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;
}
