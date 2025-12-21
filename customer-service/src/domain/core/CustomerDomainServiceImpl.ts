import { CustomerDomainService } from './CustomerDomainService';
import { Customer } from './entity/Customer';
import { CustomerCreatedEvent } from './event/CustomerCreatedEvent';

export class CustomerDomainServiceImpl implements CustomerDomainService {
  validateAndInitiateCustomer(customer: Customer): CustomerCreatedEvent {
    // Domain validation logic can be added here
    return {
      customer,
      createdAt: new Date(),
    };
  }
}
