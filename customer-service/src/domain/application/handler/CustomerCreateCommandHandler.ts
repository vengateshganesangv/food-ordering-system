import { CustomerDomainService } from '../../core/CustomerDomainService';
import { Customer } from '../../core/entity/Customer';
import { CustomerCreatedEvent } from '../../core/event/CustomerCreatedEvent';
import { CreateCustomerCommand } from '../dto/CreateCustomerCommand';
import { CreateCustomerResponse } from '../dto/CreateCustomerResponse';
import { CustomerDataMapper } from '../mapper/CustomerDataMapper';
import { CustomerRepository } from '../ports/output/repository/CustomerRepository';
import { CustomerMessagePublisher } from '../ports/output/message/CustomerMessagePublisher';

export class CustomerCreateCommandHandler {
  constructor(
    private readonly customerDomainService: CustomerDomainService,
    private readonly customerRepository: CustomerRepository,
    private readonly customerMessagePublisher: CustomerMessagePublisher,
    private readonly customerDataMapper: CustomerDataMapper,
  ) {}

  async createCustomer(createCustomerCommand: CreateCustomerCommand): Promise<CreateCustomerResponse> {
    const customer: Customer = this.customerDataMapper.createCommandToCustomer(createCustomerCommand);

    const customerCreatedEvent: CustomerCreatedEvent =
      this.customerDomainService.validateAndInitiateCustomer(customer);

    const savedCustomer: Customer = await this.customerRepository.save(customerCreatedEvent.customer);

    await this.customerMessagePublisher.publish(customerCreatedEvent);

    return this.customerDataMapper.customerToCreateResponse(
      savedCustomer,
      'Customer saved successfully',
    );
  }
}
