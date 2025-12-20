import { injectable, inject } from 'inversify';
import { CustomerCreatedEvent } from '@food-ordering-system/customer-service-domain-core';
import { CustomerApplicationService } from './ports/input/CustomerApplicationService';
import { CreateCustomerCommand } from './dto/CreateCustomerCommand';
import { CreateCustomerResponse } from './dto/CreateCustomerResponse';
import { CustomerCreateCommandHandler } from './CustomerCreateCommandHandler';
import { CustomerDataMapper } from './mapper/CustomerDataMapper';
import { CustomerMessagePublisher } from './ports/output/message/publisher/CustomerMessagePublisher';
import { TYPES } from './types';

@injectable()
export class CustomerApplicationServiceImpl implements CustomerApplicationService {
  constructor(
    @inject(TYPES.CustomerCreateCommandHandler) private readonly customerCreateCommandHandler: CustomerCreateCommandHandler,
    @inject(TYPES.CustomerDataMapper) private readonly customerDataMapper: CustomerDataMapper,
    @inject(TYPES.CustomerMessagePublisher) private readonly customerMessagePublisher: CustomerMessagePublisher
  ) {}

  async createCustomer(createCustomerCommand: CreateCustomerCommand): Promise<CreateCustomerResponse> {
    const customerCreatedEvent: CustomerCreatedEvent = await this.customerCreateCommandHandler.createCustomer(createCustomerCommand);
    await this.customerMessagePublisher.publish(customerCreatedEvent);
    return this.customerDataMapper.customerToCreateCustomerResponse(
      customerCreatedEvent.customer,
      'Customer saved successfully!'
    );
  }
}
