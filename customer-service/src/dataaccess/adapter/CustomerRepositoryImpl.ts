import { DataSource, Repository } from 'typeorm';
import { CustomerRepository } from '../../domain/application/ports/output/repository/CustomerRepository';
import { Customer } from '../../domain/core/entity/Customer';
import { CustomerEntity } from '../entity/CustomerEntity';
import { CustomerDataAccessMapper } from '../mapper/CustomerDataAccessMapper';

export class CustomerRepositoryImpl implements CustomerRepository {
  private repository: Repository<CustomerEntity>;

  constructor(
    private readonly dataSource: DataSource,
    private readonly customerDataAccessMapper: CustomerDataAccessMapper,
  ) {
    this.repository = dataSource.getRepository(CustomerEntity);
  }

  async save(customer: Customer): Promise<Customer> {
    const customerEntity = this.customerDataAccessMapper.customerToEntity(customer);
    const savedEntity = await this.repository.save(customerEntity);
    return this.customerDataAccessMapper.entityToCustomer(savedEntity);
  }

  async findByUsername(username: string): Promise<Customer | null> {
    const customerEntity = await this.repository.findOne({ where: { username } });
    return customerEntity ? this.customerDataAccessMapper.entityToCustomer(customerEntity) : null;
  }
}
