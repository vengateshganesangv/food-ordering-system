"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductId = void 0;
const BaseId_1 = require("./BaseId");
/**
 * Value object representing a product identifier
 * Uses UUID (string) as the underlying value
 */
class ProductId extends BaseId_1.BaseId {
    constructor(value) {
        super(value);
    }
}
exports.ProductId = ProductId;
