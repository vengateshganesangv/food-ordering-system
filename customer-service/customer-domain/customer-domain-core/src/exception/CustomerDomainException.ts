import { DomainException } from '@food-ordering-system/common-domain';

/**
 * Customer domain-specific exception
 * Thrown when customer domain rules or validations are violated
 */
export class CustomerDomainException extends DomainException {
  constructor(message: string, cause?: Error) {
    super(message, cause);
    this.name = 'CustomerDomainException';

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomerDomainException);
    }
  }
}
