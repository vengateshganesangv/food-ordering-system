import { CreateCustomerCommand } from '../../../create/CreateCustomerCommand';
import { CreateCustomerResponse } from '../../../create/CreateCustomerResponse';

/**
 * Customer Application Service input port
 * Defines the contract for customer application operations
 */
export interface CustomerApplicationService {
  /**
   * Creates a new customer
   * @param createCustomerCommand - The command containing customer creation data
   * @returns Promise containing the customer creation response
   */
  createCustomer(createCustomerCommand: CreateCustomerCommand): Promise<CreateCustomerResponse>;
}
