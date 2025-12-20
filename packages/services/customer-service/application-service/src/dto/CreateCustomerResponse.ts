export class CreateCustomerResponse {
  readonly customerId: string;
  readonly message: string;

  constructor(customerId: string, message: string) {
    this.customerId = customerId;
    this.message = message;
  }
}
