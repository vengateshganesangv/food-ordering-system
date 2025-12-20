import { CustomerId } from '@food-ordering/common-domain';
import { Customer } from '../../domain-core/entity/Customer';
import { CustomerEntity } from '../entity/CustomerEntity';

export class CustomerDataAccessMapper {
  customerToCustomerEntity(customer: Customer): CustomerEntity {
    return new CustomerEntity(
      customer.id!.getValue(),
      customer.getUsername(),
      customer.getFirstName(),
      customer.getLastName(),
    );
  }

  customerEntityToCustomer(entity: CustomerEntity): Customer {
    return new Customer(
      new CustomerId(entity.id),
      entity.username,
      entity.firstName,
      entity.lastName,
    );
  }
}
