"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantNotFoundException = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
class RestaurantNotFoundException extends common_domain_1.DomainException {
    constructor(message, cause) {
        super(message, cause);
        this.name = 'RestaurantNotFoundException';
    }
}
exports.RestaurantNotFoundException = RestaurantNotFoundException;
//# sourceMappingURL=RestaurantNotFoundException.js.map