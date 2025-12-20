import { CreateCustomerCommand } from './dto/CreateCustomerCommand';
import { CreateCustomerResponse } from './dto/CreateCustomerResponse';
import { CustomerApplicationService } from './ports/input/CustomerApplicationService';
import { CustomerCreateCommandHandler } from './CustomerCreateCommandHandler';
import { CustomerDataMapper } from './mapper/CustomerDataMapper';
import { CustomerMessagePublisher } from './ports/output/message/CustomerMessagePublisher';

export class CustomerApplicationServiceImpl implements CustomerApplicationService {
  constructor(
    private readonly customerCreateCommandHandler: CustomerCreateCommandHandler,
    private readonly customerDataMapper: CustomerDataMapper,
    private readonly customerMessagePublisher: CustomerMessagePublisher,
  ) {}

  async createCustomer(command: CreateCustomerCommand): Promise<CreateCustomerResponse> {
    const customerCreatedEvent = await this.customerCreateCommandHandler.createCustomer(command);
    this.customerMessagePublisher.publish(customerCreatedEvent);
    return this.customerDataMapper.customerToCreateCustomerResponse(
      customerCreatedEvent.customer,
      'Customer created successfully',
    );
  }
}
