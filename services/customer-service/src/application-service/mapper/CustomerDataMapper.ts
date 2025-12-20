import { CustomerId } from '@food-ordering/common-domain';
import { Customer } from '../../domain-core/entity/Customer';
import { CreateCustomerCommand } from '../dto/CreateCustomerCommand';
import { CreateCustomerResponse } from '../dto/CreateCustomerResponse';

export class CustomerDataMapper {
  createCustomerCommandToCustomer(command: CreateCustomerCommand): Customer {
    return new Customer(
      new CustomerId(command.customerId),
      command.username,
      command.firstName,
      command.lastName,
    );
  }

  customerToCreateCustomerResponse(customer: Customer, message: string): CreateCustomerResponse {
    return new CreateCustomerResponse(customer.id!.getValue(), message);
  }
}
