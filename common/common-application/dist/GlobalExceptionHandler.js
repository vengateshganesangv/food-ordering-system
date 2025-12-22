"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionHandler = exports.ConsoleLogger = exports.ConstraintViolationError = exports.ValidationError = void 0;
exports.createGlobalExceptionHandler = createGlobalExceptionHandler;
const ErrorDTO_1 = require("./ErrorDTO");
/**
 * Validation Error class
 * Represents validation errors in the application
 */
class ValidationError extends Error {
    constructor(message, violations) {
        super(message);
        this.name = 'ValidationError';
        this.violations = violations;
    }
}
exports.ValidationError = ValidationError;
/**
 * Constraint Violation Error class
 * Represents constraint violations during validation
 */
class ConstraintViolationError extends ValidationError {
    constructor(violations) {
        super('Constraint violations occurred', violations);
        this.name = 'ConstraintViolationError';
    }
}
exports.ConstraintViolationError = ConstraintViolationError;
/**
 * Console logger implementation
 */
class ConsoleLogger {
    error(message, error) {
        if (error) {
            console.error(message, error);
        }
        else {
            console.error(message);
        }
    }
}
exports.ConsoleLogger = ConsoleLogger;
/**
 * Global Exception Handler Middleware
 * Handles all errors in the Express application and returns consistent error responses
 */
class GlobalExceptionHandler {
    constructor(logger = new ConsoleLogger()) {
        this.logger = logger;
    }
    /**
     * Extracts violation messages from ConstraintViolationError
     * @param error - ConstraintViolationError instance
     * @returns Combined violation messages separated by '--'
     */
    extractViolationsFromException(error) {
        return error.violations?.join('--') || error.message;
    }
    /**
     * Handles ValidationError exceptions
     * @param error - ValidationError instance
     * @returns ErrorDTO with BAD_REQUEST status
     */
    handleValidationException(error) {
        let errorDTO;
        if (error instanceof ConstraintViolationError) {
            const violations = this.extractViolationsFromException(error);
            this.logger.error(violations, error);
            errorDTO = (0, ErrorDTO_1.createErrorDTO)('Bad Request', violations);
        }
        else {
            const exceptionMessage = error.message;
            this.logger.error(exceptionMessage, error);
            errorDTO = (0, ErrorDTO_1.createErrorDTO)('Bad Request', exceptionMessage);
        }
        return errorDTO;
    }
    /**
     * Handles generic exceptions
     * @param error - Error instance
     * @returns ErrorDTO with INTERNAL_SERVER_ERROR status
     */
    handleGenericException(error) {
        this.logger.error(error.message, error);
        return (0, ErrorDTO_1.createErrorDTO)('Internal Server Error', 'Unexpected error!');
    }
    /**
     * Express error handling middleware
     * Routes errors to appropriate handlers based on error type
     */
    middleware() {
        return (error, _req, res, _next) => {
            let errorDTO;
            let statusCode;
            if (error instanceof ValidationError) {
                errorDTO = this.handleValidationException(error);
                statusCode = 400; // BAD_REQUEST
            }
            else {
                errorDTO = this.handleGenericException(error);
                statusCode = 500; // INTERNAL_SERVER_ERROR
            }
            res.status(statusCode).json(errorDTO);
        };
    }
}
exports.GlobalExceptionHandler = GlobalExceptionHandler;
/**
 * Creates and returns the global exception handler middleware
 * @param logger - Optional logger instance
 * @returns Express error handling middleware
 */
function createGlobalExceptionHandler(logger) {
    const handler = new GlobalExceptionHandler(logger);
    return handler.middleware();
}
//# sourceMappingURL=GlobalExceptionHandler.js.map