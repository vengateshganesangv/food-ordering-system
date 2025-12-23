"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderOutboxNotFoundException = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
class OrderOutboxNotFoundException extends common_domain_1.DomainException {
    constructor(message, cause) {
        super(message, cause);
        this.name = 'OrderOutboxNotFoundException';
    }
}
exports.OrderOutboxNotFoundException = OrderOutboxNotFoundException;
