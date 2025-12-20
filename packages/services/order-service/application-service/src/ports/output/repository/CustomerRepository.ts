import { CustomerId } from '@food-ordering-system/common-domain';
import { Customer } from '@food-ordering-system/order-domain-core';

export interface CustomerRepository {
  findById(customerId: CustomerId): Promise<Customer | null>;
  save(customer: Customer): Promise<Customer>;
}
