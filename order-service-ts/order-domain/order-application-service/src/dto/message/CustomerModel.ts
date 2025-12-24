/**
 * Customer Model DTO
 * Represents customer information from customer service events
 */
export class CustomerModel {
  constructor(
    private readonly id: string,
    private readonly username: string,
    private readonly firstName: string,
    private readonly lastName: string,
  ) {}

  getId(): string {
    return this.id;
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

  static builder(): CustomerModelBuilder {
    return new CustomerModelBuilder();
  }

  static Builder = class CustomerModelBuilder {
    public _id?: string;
    public _username?: string;
    public _firstName?: string;
    public _lastName?: string;

    id(val: string): this {
      this._id = val;
      return this;
    }

    username(val: string): this {
      this._username = val;
      return this;
    }

    firstName(val: string): this {
      this._firstName = val;
      return this;
    }

    lastName(val: string): this {
      this._lastName = val;
      return this;
    }

    build(): CustomerModel {
      if (!this._id || !this._username || !this._firstName || !this._lastName) {
        throw new Error('Missing required fields for CustomerModel');
      }
      return new CustomerModel(this._id, this._username, this._firstName, this._lastName);
    }
  };
}
