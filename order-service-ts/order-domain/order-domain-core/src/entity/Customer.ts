import { AggregateRoot, CustomerId } from '@food-ordering-system/common-domain';

/**
 * Customer aggregate root
 * Represents a customer who places orders
 */
export class Customer extends AggregateRoot<CustomerId> {
  private username?: string;
  private firstName?: string;
  private lastName?: string;

  constructor(customerId: CustomerId, username?: string, firstName?: string, lastName?: string) {
    super();
    this.setId(customerId);
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  getUsername(): string | undefined {
    return this.username;
  }

  getFirstName(): string | undefined {
    return this.firstName;
  }

  getLastName(): string | undefined {
    return this.lastName;
  }
}
