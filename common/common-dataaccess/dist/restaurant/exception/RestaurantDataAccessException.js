"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantDataAccessException = void 0;
/**
 * Restaurant Data Access Exception
 * Thrown when there are errors accessing restaurant data
 */
class RestaurantDataAccessException extends Error {
    constructor(message) {
        super(message);
        this.name = 'RestaurantDataAccessException';
        // Maintains proper stack trace for where error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RestaurantDataAccessException);
        }
    }
}
exports.RestaurantDataAccessException = RestaurantDataAccessException;
//# sourceMappingURL=RestaurantDataAccessException.js.map