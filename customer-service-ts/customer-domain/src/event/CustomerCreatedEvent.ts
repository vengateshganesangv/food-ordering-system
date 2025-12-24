import { DomainEvent } from '@food-ordering-system/common-domain';
import { Customer } from '../entity/Customer';

/**
 * Domain event for customer creation
 * This event is fired when a new customer is successfully created
 */
export class CustomerCreatedEvent implements DomainEvent<Customer> {
  _phantom?: Customer;
  private readonly customer: Customer;
  private readonly createdAt: Date;

  constructor(customer: Customer, createdAt: Date) {
    this.customer = customer;
    this.createdAt = createdAt;
  }

  getCustomer(): Customer {
    return this.customer;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
