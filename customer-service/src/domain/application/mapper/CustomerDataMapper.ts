import { CustomerId } from '@food-ordering-system/common-domain';
import { Customer } from '../../core/entity/Customer';
import { CreateCustomerCommand } from '../dto/CreateCustomerCommand';
import { CreateCustomerResponse } from '../dto/CreateCustomerResponse';

export class CustomerDataMapper {
  createCommandToCustomer(createCustomerCommand: CreateCustomerCommand): Customer {
    return new Customer(
      new CustomerId(createCustomerCommand.customerId),
      createCustomerCommand.username,
      createCustomerCommand.firstName,
      createCustomerCommand.lastName,
    );
  }

  customerToCreateResponse(customer: Customer, message: string): CreateCustomerResponse {
    return new CreateCustomerResponse(customer.id.value, message);
  }
}
