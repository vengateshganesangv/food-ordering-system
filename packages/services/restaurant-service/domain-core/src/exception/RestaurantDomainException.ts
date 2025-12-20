export class RestaurantDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RestaurantDomainException';
  }
}
