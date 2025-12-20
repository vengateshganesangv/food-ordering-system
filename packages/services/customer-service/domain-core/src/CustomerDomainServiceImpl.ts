import { injectable } from 'inversify';
import { CustomerDomainService } from './CustomerDomainService';
import { Customer } from './entity/Customer';
import { CustomerCreatedEvent } from './event/CustomerCreatedEvent';

@injectable()
export class CustomerDomainServiceImpl implements CustomerDomainService {
  validateAndInitiateCustomer(customer: Customer): CustomerCreatedEvent {
    // Any business logic required to run for a customer creation
    console.log(`Customer with id: ${customer.getId()?.getValue()} is initiated`);
    return new CustomerCreatedEvent(customer, new Date());
  }
}
