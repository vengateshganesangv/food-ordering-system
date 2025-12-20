export class PaymentDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaymentDomainException';
  }
}
