"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderOutboxNotFoundException = void 0;
/**
 * Order Outbox Not Found Exception
 * Thrown when an expected outbox message cannot be found in the database
 */
class OrderOutboxNotFoundException extends Error {
    constructor(message) {
        super(message);
        this.name = 'OrderOutboxNotFoundException';
        Object.setPrototypeOf(this, OrderOutboxNotFoundException.prototype);
    }
}
exports.OrderOutboxNotFoundException = OrderOutboxNotFoundException;
