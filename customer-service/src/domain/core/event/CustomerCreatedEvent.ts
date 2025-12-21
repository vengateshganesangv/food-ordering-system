import { DomainEvent } from '@food-ordering-system/common-domain';
import { Customer } from '../entity/Customer';

export interface CustomerCreatedEvent extends DomainEvent<Customer> {
  customer: Customer;
  createdAt: Date;
}
