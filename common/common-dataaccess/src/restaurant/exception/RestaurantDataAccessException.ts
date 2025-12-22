/**
 * Restaurant Data Access Exception
 * Thrown when there are errors accessing restaurant data
 */
export class RestaurantDataAccessException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RestaurantDataAccessException';

    // Maintains proper stack trace for where error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RestaurantDataAccessException);
    }
  }
}
