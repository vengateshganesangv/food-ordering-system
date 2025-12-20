import { CreateCustomerCommand } from '../../dto/CreateCustomerCommand';
import { CreateCustomerResponse } from '../../dto/CreateCustomerResponse';

export interface CustomerApplicationService {
  createCustomer(createCustomerCommand: CreateCustomerCommand): Promise<CreateCustomerResponse>;
}
