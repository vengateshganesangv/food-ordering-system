import { AggregateRoot, CustomerId } from '@food-ordering-system/common-domain';

export class Customer extends AggregateRoot<CustomerId> {
  private _username?: string;
  private _firstName?: string;
  private _lastName?: string;

  constructor(customerId: CustomerId, username?: string, firstName?: string, lastName?: string) {
    super();
    this.setId(customerId);
    this._username = username;
    this._firstName = firstName;
    this._lastName = lastName;
  }

  get username(): string | undefined {
    return this._username;
  }

  get firstName(): string | undefined {
    return this._firstName;
  }

  get lastName(): string | undefined {
    return this._lastName;
  }
}
