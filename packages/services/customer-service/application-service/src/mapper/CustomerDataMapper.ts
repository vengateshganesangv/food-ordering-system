import { injectable } from 'inversify';
import { CustomerId } from '@food-ordering-system/common-domain';
import { Customer } from '@food-ordering-system/customer-service-domain-core';
import { CreateCustomerCommand } from '../dto/CreateCustomerCommand';
import { CreateCustomerResponse } from '../dto/CreateCustomerResponse';

@injectable()
export class CustomerDataMapper {
  createCustomerCommandToCustomer(createCustomerCommand: CreateCustomerCommand): Customer {
    return Customer.builder()
      .setCustomerId(new CustomerId(createCustomerCommand.customerId))
      .setUsername(createCustomerCommand.username)
      .setFirstName(createCustomerCommand.firstName)
      .setLastName(createCustomerCommand.lastName)
      .build();
  }

  customerToCreateCustomerResponse(customer: Customer, message: string): CreateCustomerResponse {
    return new CreateCustomerResponse(customer.getId()!.getValue(), message);
  }
}
