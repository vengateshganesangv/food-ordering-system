import { CustomerId } from '@food-ordering-system/common-domain';
import { Customer } from '@food-ordering-system/customer-domain-core';
import { CustomerEntity } from '../entity/CustomerEntity';

/**
 * Customer Data Access Mapper
 * Maps between domain entities and database entities
 */
export class CustomerDataAccessMapper {
  /**
   * Converts CustomerEntity to Customer domain entity
   * @param customerEntity - The database entity
   * @returns Customer domain entity
   */
  customerEntityToCustomer(customerEntity: CustomerEntity): Customer {
    return new Customer(
      new CustomerId(customerEntity.getId()),
      customerEntity.getUsername(),
      customerEntity.getFirstName(),
      customerEntity.getLastName()
    );
  }

  /**
   * Converts Customer domain entity to CustomerEntity
   * @param customer - The domain entity
   * @returns CustomerEntity database entity
   */
  customerToCustomerEntity(customer: Customer): CustomerEntity {
    const entity = new CustomerEntity();
    entity.setId(customer.getId().getValue());
    entity.setUsername(customer.getUsername());
    entity.setFirstName(customer.getFirstName());
    entity.setLastName(customer.getLastName());
    return entity;
  }
}
