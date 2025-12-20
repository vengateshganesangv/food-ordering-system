export class RestaurantApplicationServiceException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RestaurantApplicationServiceException';
  }
}
