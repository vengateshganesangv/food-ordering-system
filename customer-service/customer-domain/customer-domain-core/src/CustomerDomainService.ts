import { Customer } from './entity/Customer';
import { CustomerCreatedEvent } from './event/CustomerCreatedEvent';

/**
 * Customer Domain Service interface
 * Defines the contract for customer domain operations
 */
export interface CustomerDomainService {
  /**
   * Validates and initiates a customer
   * @param customer - The customer to validate and initiate
   * @returns CustomerCreatedEvent if validation succeeds
   */
  validateAndInitiateCustomer(customer: Customer): CustomerCreatedEvent;
}
