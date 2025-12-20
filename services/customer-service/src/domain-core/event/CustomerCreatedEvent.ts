import { DomainEvent } from '@food-ordering/common-domain';
import { Customer } from '../entity/Customer';

export class CustomerCreatedEvent implements DomainEvent<CustomerCreatedEvent> {
  constructor(
    public readonly customer: Customer,
    public readonly createdAt: Date,
  ) {}
}
