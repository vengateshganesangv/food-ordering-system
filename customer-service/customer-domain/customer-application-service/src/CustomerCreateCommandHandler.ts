import {
  CustomerDomainService,
  Customer,
  CustomerCreatedEvent,
  CustomerDomainException,
} from '@food-ordering-system/customer-domain-core';
import { CreateCustomerCommand } from './create/CreateCustomerCommand';
import { CustomerDataMapper } from './mapper/CustomerDataMapper';
import { CustomerRepository } from './ports/output/repository/CustomerRepository';

/**
 * Customer Create Command Handler
 * Handles the business logic for creating a customer
 */
export class CustomerCreateCommandHandler {
  private readonly customerDomainService: CustomerDomainService;
  private readonly customerRepository: CustomerRepository;
  private readonly customerDataMapper: CustomerDataMapper;

  constructor(
    customerDomainService: CustomerDomainService,
    customerRepository: CustomerRepository,
    customerDataMapper: CustomerDataMapper
  ) {
    this.customerDomainService = customerDomainService;
    this.customerRepository = customerRepository;
    this.customerDataMapper = customerDataMapper;
  }

  /**
   * Creates a customer with transactional semantics
   * @param createCustomerCommand - The command containing customer data
   * @returns CustomerCreatedEvent if successful
   * @throws CustomerDomainException if customer creation fails
   */
  async createCustomer(createCustomerCommand: CreateCustomerCommand): Promise<CustomerCreatedEvent> {
    const customer: Customer = this.customerDataMapper.createCustomerCommandToCustomer(createCustomerCommand);
    const customerCreatedEvent: CustomerCreatedEvent =
      this.customerDomainService.validateAndInitiateCustomer(customer);
    const savedCustomer: Customer | null = await this.customerRepository.createCustomer(customer);

    if (savedCustomer === null) {
      console.error(`Could not save customer with id: ${createCustomerCommand.getCustomerId()}`);
      throw new CustomerDomainException(
        `Could not save customer with id ${createCustomerCommand.getCustomerId()}`
      );
    }

    console.log(`Returning CustomerCreatedEvent for customer id: ${createCustomerCommand.getCustomerId()}`);
    return customerCreatedEvent;
  }
}
