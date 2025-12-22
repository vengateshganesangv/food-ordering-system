import { ErrorRequestHandler } from 'express';
/**
 * Validation Error class
 * Represents validation errors in the application
 */
export declare class ValidationError extends Error {
    violations?: string[];
    constructor(message: string, violations?: string[]);
}
/**
 * Constraint Violation Error class
 * Represents constraint violations during validation
 */
export declare class ConstraintViolationError extends ValidationError {
    constructor(violations: string[]);
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
export declare class ConsoleLogger implements Logger {
    error(message: string, error?: Error): void;
}
/**
 * Global Exception Handler Middleware
 * Handles all errors in the Express application and returns consistent error responses
 */
export declare class GlobalExceptionHandler {
    private logger;
    constructor(logger?: Logger);
    /**
     * Extracts violation messages from ConstraintViolationError
     * @param error - ConstraintViolationError instance
     * @returns Combined violation messages separated by '--'
     */
    private extractViolationsFromException;
    /**
     * Handles ValidationError exceptions
     * @param error - ValidationError instance
     * @returns ErrorDTO with BAD_REQUEST status
     */
    private handleValidationException;
    /**
     * Handles generic exceptions
     * @param error - Error instance
     * @returns ErrorDTO with INTERNAL_SERVER_ERROR status
     */
    private handleGenericException;
    /**
     * Express error handling middleware
     * Routes errors to appropriate handlers based on error type
     */
    middleware(): ErrorRequestHandler;
}
/**
 * Creates and returns the global exception handler middleware
 * @param logger - Optional logger instance
 * @returns Express error handling middleware
 */
export declare function createGlobalExceptionHandler(logger?: Logger): ErrorRequestHandler;
//# sourceMappingURL=GlobalExceptionHandler.d.ts.map