export class RestaurantDataAccessException extends Error {
  constructor(message: string, cause?: Error) {
    super(message);
    this.name = 'RestaurantDataAccessException';
    if (cause) {
      this.cause = cause;
    }
    Object.setPrototypeOf(this, RestaurantDataAccessException.prototype);
  }
}
