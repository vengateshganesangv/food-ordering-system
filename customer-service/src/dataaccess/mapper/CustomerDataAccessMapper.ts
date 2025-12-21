import { CustomerId } from '@food-ordering-system/common-domain';
import { Customer } from '../../domain/core/entity/Customer';
import { CustomerEntity } from '../entity/CustomerEntity';

export class CustomerDataAccessMapper {
  customerToEntity(customer: Customer): CustomerEntity {
    const entity = new CustomerEntity();
    entity.id = customer.id.value;
    entity.username = customer.getUsername();
    entity.firstName = customer.getFirstName();
    entity.lastName = customer.getLastName();
    return entity;
  }

  entityToCustomer(customerEntity: CustomerEntity): Customer {
    return new Customer(
      new CustomerId(customerEntity.id),
      customerEntity.username,
      customerEntity.firstName,
      customerEntity.lastName,
    );
  }
}
