import { DomainEvent } from '@food-ordering-system/common-domain';
import { Customer } from '../entity/Customer';

export class CustomerCreatedEvent implements DomainEvent<Customer> {
  private readonly _customer: Customer;
  private readonly _createdAt: Date;

  constructor(customer: Customer, createdAt: Date) {
    this._customer = customer;
    this._createdAt = createdAt;
  }

  get customer(): Customer {
    return this._customer;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
