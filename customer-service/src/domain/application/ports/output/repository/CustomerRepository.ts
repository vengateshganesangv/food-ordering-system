import { Customer } from '../../../../core/entity/Customer';

export interface CustomerRepository {
  save(customer: Customer): Promise<Customer>;
  findByUsername(username: string): Promise<Customer | null>;
}
