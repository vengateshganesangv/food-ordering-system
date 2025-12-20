import { Customer } from '../domain-core/entity/Customer';
import { CustomerCreatedEvent } from '../domain-core/event/CustomerCreatedEvent';
import { CustomerDomainException } from '../domain-core/exception/CustomerDomainException';
import { CustomerDomainService } from '../domain-core/CustomerDomainService';
import { CreateCustomerCommand } from './dto/CreateCustomerCommand';
import { CustomerDataMapper } from './mapper/CustomerDataMapper';
import { CustomerRepository } from './ports/output/repository/CustomerRepository';

export class CustomerCreateCommandHandler {
  constructor(
    private readonly customerDomainService: CustomerDomainService,
    private readonly customerRepository: CustomerRepository,
    private readonly customerDataMapper: CustomerDataMapper,
  ) {}

  async createCustomer(command: CreateCustomerCommand): Promise<CustomerCreatedEvent> {
    const customer = this.customerDataMapper.createCustomerCommandToCustomer(command);
    const customerCreatedEvent = this.customerDomainService.validateAndInitiateCustomer(customer);
    const savedCustomer = await this.customerRepository.createCustomer(customer);

    if (!savedCustomer) {
      throw new CustomerDomainException(`Could not save customer with id ${command.customerId}`);
    }

    return customerCreatedEvent;
  }
}
