import { Customer } from '@food-ordering-system/order-domain-core';

/**
 * Customer Repository interface
 * Output port for customer persistence
 */
export interface CustomerRepository {
  /**
   * Finds a customer by ID
   * @param customerId Customer ID (UUID string)
   * @returns Customer if found
   */
  findCustomer(customerId: string): Promise<Customer | undefined>;

  /**
   * Saves a customer
   * @param customer Customer to save
   * @returns Saved customer
   */
  save(customer: Customer): Promise<Customer>;
}
