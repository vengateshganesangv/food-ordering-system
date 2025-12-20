export class CustomerDataAccessException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CustomerDataAccessException';
    Object.setPrototypeOf(this, CustomerDataAccessException.prototype);
  }
}
