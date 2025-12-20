import { Customer } from '@food-ordering-system/customer-service-domain-core';

export interface CustomerRepository {
  createCustomer(customer: Customer): Promise<Customer>;
}
