import { injectable, inject } from 'inversify';
import { DataSource, Repository } from 'typeorm';
import { Customer } from '@food-ordering-system/customer-service-domain-core';
import { CustomerRepository } from '@food-ordering-system/customer-service-application-service';
import { CustomerEntity } from '../entity/CustomerEntity';
import { CustomerDataAccessMapper } from '../mapper/CustomerDataAccessMapper';
import { TYPES } from '@food-ordering-system/customer-service-application-service';

@injectable()
export class CustomerRepositoryImpl implements CustomerRepository {
  private readonly customerRepository: Repository<CustomerEntity>;

  constructor(
    @inject(TYPES.DataSource) dataSource: DataSource,
    @inject(TYPES.CustomerDataAccessMapper) private readonly customerDataAccessMapper: CustomerDataAccessMapper
  ) {
    this.customerRepository = dataSource.getRepository(CustomerEntity);
  }

  async createCustomer(customer: Customer): Promise<Customer> {
    const customerEntity = this.customerDataAccessMapper.customerToCustomerEntity(customer);
    const savedEntity = await this.customerRepository.save(customerEntity);
    return this.customerDataAccessMapper.customerEntityToCustomer(savedEntity);
  }
}
