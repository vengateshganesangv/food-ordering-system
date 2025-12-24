import { CustomerDomainService } from './CustomerDomainService';
import { Customer } from './entity/Customer';
import { CustomerCreatedEvent } from './event/CustomerCreatedEvent';

/**
 * Customer Domain Service implementation
 * Contains core business logic for customer operations
 */
export class CustomerDomainServiceImpl implements CustomerDomainService {
  /**
   * Validates and initiates a customer
   * Any business logic required to run for customer creation should be added here
   * @param customer - The customer to validate and initiate
   * @returns CustomerCreatedEvent with the customer and creation timestamp
   */
  validateAndInitiateCustomer(customer: Customer): CustomerCreatedEvent {
    // Any Business logic required to run for a customer creation
    console.log(`Customer with id: ${customer.getId()!.getValue()} is initiated`);
    return new CustomerCreatedEvent(customer, new Date());
  }
}
