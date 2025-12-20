export class CreateCustomerResponse {
  constructor(
    public readonly customerId: string,
    public readonly message: string,
  ) {}
}
