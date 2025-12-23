"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentDomainException = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
class PaymentDomainException extends common_domain_1.DomainException {
    constructor(message, cause) {
        super(message, cause);
        this.name = 'PaymentDomainException';
    }
}
exports.PaymentDomainException = PaymentDomainException;
//# sourceMappingURL=PaymentDomainException.js.map