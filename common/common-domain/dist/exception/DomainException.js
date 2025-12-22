"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainException = void 0;
/**
 * Base exception for domain-related errors
 */
class DomainException extends Error {
    constructor(message, cause) {
        super(message);
        this.name = 'DomainException';
        this.cause = cause;
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DomainException);
        }
    }
}
exports.DomainException = DomainException;
//# sourceMappingURL=DomainException.js.map