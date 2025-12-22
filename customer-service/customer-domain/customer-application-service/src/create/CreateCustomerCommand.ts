/**
 * Command DTO for creating a customer
 * Represents the input data required to create a new customer
 */
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

  getCustomerId(): string {
    return this.customerId;
  }

  getUsername(): string {
    return this.username;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }
}
