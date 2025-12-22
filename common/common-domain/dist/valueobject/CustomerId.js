"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerId = void 0;
const BaseId_1 = require("./BaseId");
/**
 * Value object representing a customer identifier
 * Uses UUID (string) as the underlying value
 */
class CustomerId extends BaseId_1.BaseId {
    constructor(value) {
        super(value);
    }
}
exports.CustomerId = CustomerId;
//# sourceMappingURL=CustomerId.js.map