import { injectable, inject } from 'inversify';
import { CustomerDomainService, Customer, CustomerCreatedEvent, CustomerDomainException } from '@food-ordering-system/customer-service-domain-core';
import { CreateCustomerCommand } from './dto/CreateCustomerCommand';
import { CustomerRepository } from './ports/output/repository/CustomerRepository';
import { CustomerDataMapper } from './mapper/CustomerDataMapper';
import { TYPES } from './types';

@injectable()
export class CustomerCreateCommandHandler {
  constructor(
    @inject(TYPES.CustomerDomainService) private readonly customerDomainService: CustomerDomainService,
    @inject(TYPES.CustomerRepository) private readonly customerRepository: CustomerRepository,
    @inject(TYPES.CustomerDataMapper) private readonly customerDataMapper: CustomerDataMapper
  ) {}

  async createCustomer(createCustomerCommand: CreateCustomerCommand): Promise<CustomerCreatedEvent> {
    const customer: Customer = this.customerDataMapper.createCustomerCommandToCustomer(createCustomerCommand);
    const customerCreatedEvent: CustomerCreatedEvent = this.customerDomainService.validateAndInitiateCustomer(customer);
    const savedCustomer: Customer = await this.customerRepository.createCustomer(customer);

    if (!savedCustomer) {
      console.error(`Could not save customer with id: ${createCustomerCommand.customerId}`);
      throw new CustomerDomainException(`Could not save customer with id ${createCustomerCommand.customerId}`);
    }

    console.log(`Returning CustomerCreatedEvent for customer id: ${createCustomerCommand.customerId}`);
    return customerCreatedEvent;
  }
}
