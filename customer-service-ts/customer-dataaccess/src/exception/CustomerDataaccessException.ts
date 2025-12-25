/**
 * Customer Data Access Exception
 * Thrown when database operations fail
 */
export class CustomerDataaccessException extends Error {
  public readonly cause?: Error;

  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'CustomerDataaccessException';
    this.cause = cause;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomerDataaccessException);
    }
  }
}
