import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ErrorDTO, createErrorDTO } from './ErrorDTO';

/**
 * Validation Error class
 * Represents validation errors in the application
 */
export class ValidationError extends Error {
  public violations?: string[];

  constructor(message: string, violations?: string[]) {
    super(message);
    this.name = 'ValidationError';
    this.violations = violations;
  }
}

/**
 * Constraint Violation Error class
 * Represents constraint violations during validation
 */
export class ConstraintViolationError extends ValidationError {
  constructor(violations: string[]) {
    super('Constraint violations occurred', violations);
    this.name = 'ConstraintViolationError';
  }
}

/**
 * Logger interface for dependency injection
 */
export interface Logger {
  error(message: string, error?: Error): void;
}

/**
 * Console logger implementation
 */
export class ConsoleLogger implements Logger {
  error(message: string, error?: Error): void {
    if (error) {
      console.error(message, error);
    } else {
      console.error(message);
    }
  }
}

/**
 * Global Exception Handler Middleware
 * Handles all errors in the Express application and returns consistent error responses
 */
export class GlobalExceptionHandler {
  private logger: Logger;

  constructor(logger: Logger = new ConsoleLogger()) {
    this.logger = logger;
  }

  /**
   * Extracts violation messages from ConstraintViolationError
   * @param error - ConstraintViolationError instance
   * @returns Combined violation messages separated by '--'
   */
  private extractViolationsFromException(error: ConstraintViolationError): string {
    return error.violations?.join('--') || error.message;
  }

  /**
   * Handles ValidationError exceptions
   * @param error - ValidationError instance
   * @returns ErrorDTO with BAD_REQUEST status
   */
  private handleValidationException(error: ValidationError): ErrorDTO {
    let errorDTO: ErrorDTO;

    if (error instanceof ConstraintViolationError) {
      const violations = this.extractViolationsFromException(error);
      this.logger.error(violations, error);
      errorDTO = createErrorDTO('Bad Request', violations);
    } else {
      const exceptionMessage = error.message;
      this.logger.error(exceptionMessage, error);
      errorDTO = createErrorDTO('Bad Request', exceptionMessage);
    }

    return errorDTO;
  }

  /**
   * Handles generic exceptions
   * @param error - Error instance
   * @returns ErrorDTO with INTERNAL_SERVER_ERROR status
   */
  private handleGenericException(error: Error): ErrorDTO {
    this.logger.error(error.message, error);
    return createErrorDTO('Internal Server Error', 'Unexpected error!');
  }

  /**
   * Express error handling middleware
   * Routes errors to appropriate handlers based on error type
   */
  public middleware(): ErrorRequestHandler {
    return (error: Error, _req: Request, res: Response, _next: NextFunction): void => {
      let errorDTO: ErrorDTO;
      let statusCode: number;

      if (error instanceof ValidationError) {
        errorDTO = this.handleValidationException(error);
        statusCode = 400; // BAD_REQUEST
      } else {
        errorDTO = this.handleGenericException(error);
        statusCode = 500; // INTERNAL_SERVER_ERROR
      }

      res.status(statusCode).json(errorDTO);
    };
  }
}

/**
 * Creates and returns the global exception handler middleware
 * @param logger - Optional logger instance
 * @returns Express error handling middleware
 */
export function createGlobalExceptionHandler(logger?: Logger): ErrorRequestHandler {
  const handler = new GlobalExceptionHandler(logger);
  return handler.middleware();
}
