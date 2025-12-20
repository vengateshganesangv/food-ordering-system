import { Request, Response } from 'express';
import { CustomerApplicationService } from '../application-service/ports/input/CustomerApplicationService';
import { CreateCustomerCommand } from '../application-service/dto/CreateCustomerCommand';
import { GlobalExceptionHandler } from '@food-ordering/common-application';

export class CustomerController {
  constructor(private readonly customerApplicationService: CustomerApplicationService) {}

  async createCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { customerId, username, firstName, lastName } = req.body;

      const command = new CreateCustomerCommand(customerId, username, firstName, lastName);
      const response = await this.customerApplicationService.createCustomer(command);

      res.status(201).json(response);
    } catch (error) {
      const { status, body } = GlobalExceptionHandler.handleException(error as Error);
      res.status(status).json(body);
    }
  }
}
