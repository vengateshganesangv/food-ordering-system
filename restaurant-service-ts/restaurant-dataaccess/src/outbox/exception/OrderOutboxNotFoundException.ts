/**
 * Order Outbox Not Found Exception
 * Thrown when an expected outbox message cannot be found in the database
 */
export class OrderOutboxNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrderOutboxNotFoundException';
    Object.setPrototypeOf(this, OrderOutboxNotFoundException.prototype);
  }
}
