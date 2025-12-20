export class CreateCustomerCommand {
  constructor(
    public readonly customerId: string,
    public readonly username: string,
    public readonly firstName: string,
    public readonly lastName: string,
  ) {}
}
