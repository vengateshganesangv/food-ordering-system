import { DomainException } from '@food-ordering-system/common-domain';

/**
 * Restaurant Application Service Exception
 * Thrown when application-level errors occur in restaurant service
 */
export class RestaurantApplicationServiceException extends DomainException {
  constructor(message: string, cause?: Error) {
    super(message, cause);
    this.name = 'RestaurantApplicationServiceException';

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RestaurantApplicationServiceException);
    }
  }
}
