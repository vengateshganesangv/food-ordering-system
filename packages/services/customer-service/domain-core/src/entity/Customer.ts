import { AggregateRoot, CustomerId } from '@food-ordering-system/common-domain';

interface CustomerProps {
  customerId?: CustomerId;
  username: string;
  firstName: string;
  lastName: string;
}

export class Customer extends AggregateRoot<CustomerId> {
  private readonly _username: string;
  private readonly _firstName: string;
  private readonly _lastName: string;

  private constructor(props: CustomerProps) {
    super();
    if (props.customerId) {
      this.setId(props.customerId);
    }
    this._username = props.username;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
  }

  static builder(): CustomerBuilder {
    return new CustomerBuilder();
  }

  get username(): string {
    return this._username;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }
}

class CustomerBuilder {
  private customerId?: CustomerId;
  private username?: string;
  private firstName?: string;
  private lastName?: string;

  setCustomerId(customerId: CustomerId): CustomerBuilder {
    this.customerId = customerId;
    return this;
  }

  setUsername(username: string): CustomerBuilder {
    this.username = username;
    return this;
  }

  setFirstName(firstName: string): CustomerBuilder {
    this.firstName = firstName;
    return this;
  }

  setLastName(lastName: string): CustomerBuilder {
    this.lastName = lastName;
    return this;
  }

  build(): Customer {
    if (!this.username || !this.firstName || !this.lastName) {
      throw new Error('Username, FirstName, and LastName are required');
    }
    return new Customer({
      customerId: this.customerId,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
    });
  }
}
