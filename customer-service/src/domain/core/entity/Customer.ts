import { AggregateRoot, CustomerId } from '@food-ordering-system/common-domain';

export class Customer extends AggregateRoot<CustomerId> {
  private readonly username: string;
  private readonly firstName: string;
  private readonly lastName: string;

  constructor(customerId: CustomerId, username: string, firstName: string, lastName: string) {
    super();
    this.id = customerId;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
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
