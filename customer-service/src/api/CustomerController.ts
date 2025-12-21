import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CustomerApplicationService } from '../domain/application/ports/input/CustomerApplicationService';
import { CreateCustomerCommand } from '../domain/application/dto/CreateCustomerCommand';

export class CustomerController {
  constructor(private readonly customerApplicationService: CustomerApplicationService) {}

  async createCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createCustomerCommand = plainToClass(CreateCustomerCommand, req.body);

      const errors = await validate(createCustomerCommand);
      if (errors.length > 0) {
        res.status(400).json({ errors: errors.map((e) => Object.values(e.constraints || {})) });
        return;
      }

      console.log(`Creating customer with username: ${createCustomerCommand.username}`);

      const response = await this.customerApplicationService.createCustomer(createCustomerCommand);

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
