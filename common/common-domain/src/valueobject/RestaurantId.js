"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantId = void 0;
const BaseId_1 = require("./BaseId");
/**
 * Value object representing a restaurant identifier
 * Uses UUID (string) as the underlying value
 */
class RestaurantId extends BaseId_1.BaseId {
    constructor(value) {
        super(value);
    }
}
exports.RestaurantId = RestaurantId;
