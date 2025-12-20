import { Customer } from './entity/Customer';
import { CustomerCreatedEvent } from './event/CustomerCreatedEvent';

export interface CustomerDomainService {
  validateAndInitiateCustomer(customer: Customer): CustomerCreatedEvent;
}
