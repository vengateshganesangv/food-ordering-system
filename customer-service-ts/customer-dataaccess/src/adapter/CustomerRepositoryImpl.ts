import { Customer } from '@food-ordering-system/customer-domain-core';
import { CustomerRepository } from '@food-ordering-system/customer-application-service';
import { CustomerJpaRepository } from '../repository/CustomerJpaRepository';
import { CustomerDataAccessMapper } from '../mapper/CustomerDataAccessMapper';
import { CustomerEntity } from '../entity/CustomerEntity';

/**
 * Customer Repository Implementation
 * Adapter that implements the CustomerRepository port using TypeORM
 */
export class CustomerRepositoryImpl implements CustomerRepository {
  private readonly customerJpaRepository: CustomerJpaRepository;
  private readonly customerDataAccessMapper: CustomerDataAccessMapper;

  constructor(
    customerJpaRepository: CustomerJpaRepository,
    customerDataAccessMapper: CustomerDataAccessMapper
  ) {
    this.customerJpaRepository = customerJpaRepository;
    this.customerDataAccessMapper = customerDataAccessMapper;
  }

  /**
   * Creates a customer in the database
   * @param customer - The customer domain entity to create
   * @returns The created customer or null if creation failed
   */
  async createCustomer(customer: Customer): Promise<Customer | null> {
    try {
      const customerEntity: CustomerEntity = this.customerDataAccessMapper.customerToCustomerEntity(customer);
      const savedEntity: CustomerEntity = await this.customerJpaRepository.save(customerEntity);
      return this.customerDataAccessMapper.customerEntityToCustomer(savedEntity);
    } catch (error) {
      console.error('Error creating customer:', error);
      return null;
    }
  }
}
