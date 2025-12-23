"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantDomainException = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
class RestaurantDomainException extends common_domain_1.DomainException {
    constructor(message, cause) {
        super(message, cause);
        this.name = 'RestaurantDomainException';
    }
}
exports.RestaurantDomainException = RestaurantDomainException;
//# sourceMappingURL=RestaurantDomainException.js.map