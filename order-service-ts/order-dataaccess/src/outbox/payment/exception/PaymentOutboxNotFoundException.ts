export class PaymentOutboxNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaymentOutboxNotFoundException';
    Object.setPrototypeOf(this, PaymentOutboxNotFoundException.prototype);
  }
}
