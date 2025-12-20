export class StreetAddress {
  private readonly _id: string;
  private readonly _street: string;
  private readonly _postalCode: string;
  private readonly _city: string;

  constructor(id: string, street: string, postalCode: string, city: string) {
    this._id = id;
    this._street = street;
    this._postalCode = postalCode;
    this._city = city;
  }

  get id(): string {
    return this._id;
  }

  get street(): string {
    return this._street;
  }

  get postalCode(): string {
    return this._postalCode;
  }

  get city(): string {
    return this._city;
  }

  equals(other: StreetAddress): boolean {
    if (!other) return false;
    return (
      this._street === other._street &&
      this._postalCode === other._postalCode &&
      this._city === other._city
    );
  }
}
