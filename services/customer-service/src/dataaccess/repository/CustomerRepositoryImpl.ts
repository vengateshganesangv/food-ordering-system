import { DatabaseClient } from '@food-ordering/common-dataaccess';
import { Customer } from '../../domain-core/entity/Customer';
import { CustomerRepository } from '../../application-service/ports/output/repository/CustomerRepository';
import { CustomerDataAccessMapper } from '../mapper/CustomerDataAccessMapper';

export class CustomerRepositoryImpl implements CustomerRepository {
  constructor(
    private readonly databaseClient: DatabaseClient,
    private readonly mapper: CustomerDataAccessMapper,
  ) {}

  async createCustomer(customer: Customer): Promise<Customer | null> {
    const entity = this.mapper.customerToCustomerEntity(customer);

    const query = `
      INSERT INTO customers (id, username, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    try {
      const result = await this.databaseClient.query(query, [
        entity.id,
        entity.username,
        entity.firstName,
        entity.lastName,
      ]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return this.mapper.customerEntityToCustomer({
        id: row.id,
        username: row.username,
        firstName: row.first_name,
        lastName: row.last_name,
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      return null;
    }
  }
}
