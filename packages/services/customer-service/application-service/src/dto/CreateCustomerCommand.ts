export class CreateCustomerCommand {
  readonly customerId: string;
  readonly username: string;
  readonly firstName: string;
  readonly lastName: string;

  constructor(customerId: string, username: string, firstName: string, lastName: string) {
    this.customerId = customerId;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
