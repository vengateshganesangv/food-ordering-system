import { CustomerId } from '@food-ordering-system/common-domain';
import { Customer } from '@food-ordering-system/customer-domain-core';
import { CreateCustomerCommand } from '../create/CreateCustomerCommand';
import { CreateCustomerResponse } from '../create/CreateCustomerResponse';

/**
 * Customer Data Mapper
 * Maps between application layer DTOs and domain entities
 */
export class CustomerDataMapper {
  /**
   * Converts CreateCustomerCommand to Customer entity
   * @param createCustomerCommand - The command DTO
   * @returns Customer domain entity
   */
  createCustomerCommandToCustomer(createCustomerCommand: CreateCustomerCommand): Customer {
    return new Customer(
      new CustomerId(createCustomerCommand.getCustomerId()),
      createCustomerCommand.getUsername(),
      createCustomerCommand.getFirstName(),
      createCustomerCommand.getLastName()
    );
  }

  /**
   * Converts Customer entity to CreateCustomerResponse
   * @param customer - The customer entity
   * @param message - Response message
   * @returns CreateCustomerResponse DTO
   */
  customerToCreateCustomerResponse(customer: Customer, message: string): CreateCustomerResponse {
    return new CreateCustomerResponse(customer.getId().getValue(), message);
  }
}
