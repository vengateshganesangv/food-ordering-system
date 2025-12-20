export class RestaurantNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RestaurantNotFoundException';
  }
}
