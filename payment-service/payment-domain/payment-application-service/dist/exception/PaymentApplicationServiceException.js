"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentApplicationServiceException = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
class PaymentApplicationServiceException extends common_domain_1.DomainException {
    constructor(message, cause) {
        super(message, cause);
        this.name = 'PaymentApplicationServiceException';
    }
}
exports.PaymentApplicationServiceException = PaymentApplicationServiceException;
//# sourceMappingURL=PaymentApplicationServiceException.js.map