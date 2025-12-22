import { Customer } from '@food-ordering-system/customer-domain-core';

/**
 * Customer Repository output port
 * Defines the contract for customer persistence operations
 */
export interface CustomerRepository {
  /**
   * Creates a customer in the database
   * @param customer - The customer to create
   * @returns The created customer or null if creation failed
   */
  createCustomer(customer: Customer): Promise<Customer | null>;
}
