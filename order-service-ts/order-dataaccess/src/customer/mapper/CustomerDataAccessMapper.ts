import { CustomerId } from '@food-ordering-system/common-domain';
import { Customer } from '@food-ordering-system/order-domain-core';
import { CustomerEntity } from '../entity/CustomerEntity';

export class CustomerDataAccessMapper {
  customerEntityToCustomer(customerEntity: CustomerEntity): Customer {
    return new Customer(
      new CustomerId(customerEntity.id),
      customerEntity.username,
      customerEntity.firstName,
      customerEntity.lastName,
    );
  }

  customerToCustomerEntity(customer: Customer): CustomerEntity {
    const entity = new CustomerEntity();
    const customerId = customer.getId();
    if (!customerId) {
      throw new Error('Customer ID must be set');
    }
    entity.id = customerId.getValue();
    entity.username = customer.getUsername()!;
    entity.firstName = customer.getFirstName()!;
    entity.lastName = customer.getLastName()!;
    return entity;
  }
}
