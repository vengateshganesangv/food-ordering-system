/**
 * Order Address DTO
 * Represents the delivery address for an order
 */
export class OrderAddress {
  constructor(
    private readonly street: string,
    private readonly postalCode: string,
    private readonly city: string,
  ) {
    if (!street || street.length > 50) {
      throw new Error('Street must not be null and must be max 50 characters');
    }
    if (!postalCode || postalCode.length > 10) {
      throw new Error('Postal code must not be null and must be max 10 characters');
    }
    if (!city || city.length > 50) {
      throw new Error('City must not be null and must be max 50 characters');
    }
  }

  getStreet(): string {
    return this.street;
  }

  getPostalCode(): string {
    return this.postalCode;
  }

  getCity(): string {
    return this.city;
  }

  static builder(): OrderAddressBuilder {
    return new OrderAddressBuilder();
  }

  static Builder = class OrderAddressBuilder {
    public _street?: string;
    public _postalCode?: string;
    public _city?: string;

    street(val: string): this {
      this._street = val;
      return this;
    }

    postalCode(val: string): this {
      this._postalCode = val;
      return this;
    }

    city(val: string): this {
      this._city = val;
      return this;
    }

    build(): OrderAddress {
      if (!this._street || !this._postalCode || !this._city) {
        throw new Error('Missing required fields for OrderAddress');
      }
      return new OrderAddress(this._street, this._postalCode, this._city);
    }
  };
}
