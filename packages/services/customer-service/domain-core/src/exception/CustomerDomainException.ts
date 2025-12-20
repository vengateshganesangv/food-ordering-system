export class CustomerDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CustomerDomainException';
    Object.setPrototypeOf(this, CustomerDomainException.prototype);
  }
}
