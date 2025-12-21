import { CustomerApplicationService } from './ports/input/CustomerApplicationService';
import { CreateCustomerCommand } from './dto/CreateCustomerCommand';
import { CreateCustomerResponse } from './dto/CreateCustomerResponse';
import { CustomerCreateCommandHandler } from './handler/CustomerCreateCommandHandler';

export class CustomerApplicationServiceImpl implements CustomerApplicationService {
  constructor(private readonly customerCreateCommandHandler: CustomerCreateCommandHandler) {}

  async createCustomer(createCustomerCommand: CreateCustomerCommand): Promise<CreateCustomerResponse> {
    return await this.customerCreateCommandHandler.createCustomer(createCustomerCommand);
  }
}
