import { Customer } from './entity/Customer';
import { CustomerCreatedEvent } from './event/CustomerCreatedEvent';
import { CustomerDomainService } from './CustomerDomainService';

export class CustomerDomainServiceImpl implements CustomerDomainService {
  validateAndInitiateCustomer(customer: Customer): CustomerCreatedEvent {
    // Add any domain validation logic here
    return new CustomerCreatedEvent(customer, new Date());
  }
}
