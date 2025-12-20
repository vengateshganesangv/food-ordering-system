import { injectable } from 'inversify';
import { CustomerId } from '@food-ordering-system/common-domain';
import { Customer } from '@food-ordering-system/customer-service-domain-core';
import { CustomerEntity } from '../entity/CustomerEntity';

@injectable()
export class CustomerDataAccessMapper {
  customerEntityToCustomer(customerEntity: CustomerEntity): Customer {
    return Customer.builder()
      .setCustomerId(new CustomerId(customerEntity.id))
      .setUsername(customerEntity.username)
      .setFirstName(customerEntity.firstName)
      .setLastName(customerEntity.lastName)
      .build();
  }

  customerToCustomerEntity(customer: Customer): CustomerEntity {
    const customerEntity = new CustomerEntity();
    customerEntity.id = customer.getId()!.getValue();
    customerEntity.username = customer.username;
    customerEntity.firstName = customer.firstName;
    customerEntity.lastName = customer.lastName;
    return customerEntity;
  }
}
