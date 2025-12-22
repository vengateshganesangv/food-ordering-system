import { Router, Request, Response, NextFunction } from 'express';
import {
  CustomerApplicationService,
  CreateCustomerCommand,
  CreateCustomerResponse,
} from '@food-ordering-system/customer-application-service';

/**
 * Customer REST Controller
 * Handles HTTP requests for customer operations
 */
export class CustomerController {
  private readonly customerApplicationService: CustomerApplicationService;
  private readonly router: Router;

  constructor(customerApplicationService: CustomerApplicationService) {
    this.customerApplicationService = customerApplicationService;
    this.router = Router();
    this.initializeRoutes();
  }

  /**
   * Initialize REST endpoints
   */
  private initializeRoutes(): void {
    this.router.post('/', this.createCustomer.bind(this));
  }

  /**
   * Creates a new customer
   * POST /customers
   * @param req - Express request
   * @param res - Express response
   * @param next - Express next function
   */
  private async createCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { customerId, username, firstName, lastName } = req.body;

      console.log(`Creating customer with username: ${username}`);

      const command = new CreateCustomerCommand(customerId, username, firstName, lastName);
      const response: CreateCustomerResponse = await this.customerApplicationService.createCustomer(command);

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get the Express router
   * @returns Express Router instance
   */
  getRouter(): Router {
    return this.router;
  }
}

/**
 * Creates and returns the customer controller router
 * @param customerApplicationService - The customer application service
 * @returns Express Router
 */
export function createCustomerRouter(customerApplicationService: CustomerApplicationService): Router {
  const controller = new CustomerController(customerApplicationService);
  return controller.getRouter();
}
