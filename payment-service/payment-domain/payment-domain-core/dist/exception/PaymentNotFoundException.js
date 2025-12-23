"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentNotFoundException = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
class PaymentNotFoundException extends common_domain_1.DomainException {
    constructor(message, cause) {
        super(message, cause);
        this.name = 'PaymentNotFoundException';
    }
}
exports.PaymentNotFoundException = PaymentNotFoundException;
//# sourceMappingURL=PaymentNotFoundException.js.map