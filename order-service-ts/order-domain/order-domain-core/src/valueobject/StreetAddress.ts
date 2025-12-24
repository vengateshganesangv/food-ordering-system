/**
 * Street Address value object
 * Represents a delivery address
 */
export class StreetAddress {
  constructor(
    private readonly id: string,
    private readonly street: string,
    private readonly postalCode: string,
    private readonly city: string,
  ) {}

  getId(): string {
    return this.id;
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

  equals(other: StreetAddress | null | undefined): boolean {
    if (!other) return false;
    if (this === other) return true;
    return (
      this.street === other.street &&
      this.postalCode === other.postalCode &&
      this.city === other.city
    );
  }

  hashCode(): number {
    return (
      this.street.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) +
      this.postalCode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) +
      this.city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    );
  }
}
