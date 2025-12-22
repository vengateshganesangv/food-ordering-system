import { DataSource, Repository } from 'typeorm';
import { CustomerEntity } from '../entity/CustomerEntity';

/**
 * Customer JPA Repository
 * Provides database access methods for CustomerEntity using TypeORM
 */
export class CustomerJpaRepository extends Repository<CustomerEntity> {
  constructor(dataSource: DataSource) {
    super(CustomerEntity, dataSource.createEntityManager());
  }
}

/**
 * Factory function to create CustomerJpaRepository instance
 * @param dataSource - TypeORM DataSource
 * @returns CustomerJpaRepository instance
 */
export function createCustomerJpaRepository(dataSource: DataSource): CustomerJpaRepository {
  return new CustomerJpaRepository(dataSource);
}
