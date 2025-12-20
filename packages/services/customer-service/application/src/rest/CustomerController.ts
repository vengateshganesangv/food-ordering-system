import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'inversify';
import {
  CustomerApplicationService,
  CreateCustomerCommand,
  TYPES
} from '@food-ordering-system/customer-service-application-service';

export class CustomerController {
  private router: Router;
  private customerApplicationService: CustomerApplicationService;

  constructor(container: Container) {
    this.router = Router();
    this.customerApplicationService = container.get<CustomerApplicationService>(TYPES.CustomerApplicationService);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post('/', this.createCustomer.bind(this));
  }

  private async createCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { customerId, username, firstName, lastName } = req.body;
      const createCustomerCommand = new CreateCustomerCommand(customerId, username, firstName, lastName);

      console.log('Creating customer with username:', createCustomerCommand.username);

      const createCustomerResponse = await this.customerApplicationService.createCustomer(createCustomerCommand);
      console.log('Customer created with id:', createCustomerResponse.customerId);

      res.status(200).json(createCustomerResponse);
    } catch (error) {
      next(error);
    }
  }

  getRouter(): Router {
    return this.router;
  }
}
