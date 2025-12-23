"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderId = void 0;
const BaseId_1 = require("./BaseId");
/**
 * Value object representing an order identifier
 * Uses UUID (string) as the underlying value
 */
class OrderId extends BaseId_1.BaseId {
    constructor(value) {
        super(value);
    }
}
exports.OrderId = OrderId;
