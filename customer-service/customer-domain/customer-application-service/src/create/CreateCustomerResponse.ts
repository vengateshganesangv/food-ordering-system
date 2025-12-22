/**
 * Response DTO for customer creation
 * Represents the output data returned after creating a customer
 */
export class CreateCustomerResponse {
  readonly customerId: string;
  readonly message: string;

  constructor(customerId: string, message: string) {
    this.customerId = customerId;
    this.message = message;
  }

  getCustomerId(): string {
    return this.customerId;
  }

  getMessage(): string {
    return this.message;
  }
}
