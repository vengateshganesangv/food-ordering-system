import { Customer } from '@food-ordering-system/order-domain-core';
import { CustomerRepository } from '@food-ordering-system/order-application-service';
import { CustomerJpaRepository } from '../repository/CustomerJpaRepository';
import { CustomerDataAccessMapper } from '../mapper/CustomerDataAccessMapper';

export class CustomerRepositoryImpl implements CustomerRepository {
  constructor(
    private readonly customerJpaRepository: CustomerJpaRepository,
    private readonly customerDataAccessMapper: CustomerDataAccessMapper,
  ) {}

  async findCustomer(customerId: string): Promise<Customer | undefined> {
    const customerEntity = await this.customerJpaRepository.findById(customerId);
    return customerEntity ? this.customerDataAccessMapper.customerEntityToCustomer(customerEntity) : undefined;
  }

  async save(customer: Customer): Promise<Customer> {
    const customerEntity = this.customerDataAccessMapper.customerToCustomerEntity(customer);
    const savedEntity = await this.customerJpaRepository.save(customerEntity);
    return this.customerDataAccessMapper.customerEntityToCustomer(savedEntity);
  }
}
