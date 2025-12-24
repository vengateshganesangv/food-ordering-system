import { CustomerCreatedEvent } from '@food-ordering-system/customer-domain-core';
import { CreateCustomerCommand } from './create/CreateCustomerCommand';
import { CreateCustomerResponse } from './create/CreateCustomerResponse';
import { CustomerCreateCommandHandler } from './CustomerCreateCommandHandler';
import { CustomerDataMapper } from './mapper/CustomerDataMapper';
import { CustomerApplicationService } from './ports/input/service/CustomerApplicationService';
import { CustomerMessagePublisher } from './ports/output/message/publisher/CustomerMessagePublisher';

/**
 * Customer Application Service Implementation
 * Orchestrates customer-related use cases and coordinates between domain, infrastructure, and presentation layers
 */
export class CustomerApplicationServiceImpl implements CustomerApplicationService {
  private readonly customerCreateCommandHandler: CustomerCreateCommandHandler;
  private readonly customerDataMapper: CustomerDataMapper;
  private readonly customerMessagePublisher: CustomerMessagePublisher;

  constructor(
    customerCreateCommandHandler: CustomerCreateCommandHandler,
    customerDataMapper: CustomerDataMapper,
    customerMessagePublisher: CustomerMessagePublisher
  ) {
    this.customerCreateCommandHandler = customerCreateCommandHandler;
    this.customerDataMapper = customerDataMapper;
    this.customerMessagePublisher = customerMessagePublisher;
  }

  /**
   * Creates a customer and publishes the customer created event
   * @param createCustomerCommand - The command containing customer data
   * @returns Promise containing the customer creation response
   */
  async createCustomer(createCustomerCommand: CreateCustomerCommand): Promise<CreateCustomerResponse> {
    const customerCreatedEvent: CustomerCreatedEvent =
      await this.customerCreateCommandHandler.createCustomer(createCustomerCommand);
    this.customerMessagePublisher.publish(customerCreatedEvent);
    return this.customerDataMapper.customerToCreateCustomerResponse(
      customerCreatedEvent.getCustomer(),
      'Customer saved successfully!'
    );
  }
}
