import { Request, Response, NextFunction } from 'express';
import { ErrorDTO, createErrorDTO } from '@food-ordering-system/common-application';
import { CustomerDomainException } from '@food-ordering-system/customer-domain-core';

/**
 * Customer Global Exception Handler
 * Handles customer-specific exceptions in the REST API
 */
export class CustomerGlobalExceptionHandler {
  /**
   * Handles CustomerDomainException
   * @param error - CustomerDomainException instance
   * @param req - Express request
   * @param res - Express response
   * @param next - Express next function
   */
  handleCustomerDomainException(
    error: CustomerDomainException,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    console.error(error.message, error);
    const errorDTO: ErrorDTO = createErrorDTO('Bad Request', error.message);
    res.status(400).json(errorDTO);
  }

  /**
   * Express middleware for handling customer domain exceptions
   */
  middleware() {
    return (error: Error, req: Request, res: Response, next: NextFunction): void => {
      if (error instanceof CustomerDomainException) {
        this.handleCustomerDomainException(error, req, res, next);
      } else {
        // Pass to the global exception handler
        next(error);
      }
    };
  }
}

/**
 * Creates and returns the customer exception handler middleware
 * @returns Express error handling middleware
 */
export function createCustomerExceptionHandler() {
  const handler = new CustomerGlobalExceptionHandler();
  return handler.middleware();
}
