import { Customer } from '../../../../domain-core/entity/Customer';

export interface CustomerRepository {
  createCustomer(customer: Customer): Promise<Customer | null>;
}
