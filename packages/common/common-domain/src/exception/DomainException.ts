export class DomainException extends Error {
  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'DomainException';
    if (cause) {
      this.cause = cause;
    }
    Object.setPrototypeOf(this, DomainException.prototype);
  }
}
