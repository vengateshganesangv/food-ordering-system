import { AggregateRoot, CustomerId } from '@food-ordering/common-domain';

export class Customer extends AggregateRoot<CustomerId> {
  constructor(
    customerId: CustomerId,
    private readonly username: string,
    private readonly firstName: string,
    private readonly lastName: string,
  ) {
    super();
    this.setId(customerId);
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
