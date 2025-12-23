"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentDataaccessException = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
class PaymentDataaccessException extends common_domain_1.DomainException {
    constructor(message, cause) {
        super(message, cause);
        this.name = 'PaymentDataaccessException';
    }
}
exports.PaymentDataaccessException = PaymentDataaccessException;
