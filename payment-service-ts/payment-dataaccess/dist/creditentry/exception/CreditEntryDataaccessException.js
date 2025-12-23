"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditEntryDataaccessException = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
class CreditEntryDataaccessException extends common_domain_1.DomainException {
    constructor(message, cause) {
        super(message, cause);
        this.name = 'CreditEntryDataaccessException';
    }
}
exports.CreditEntryDataaccessException = CreditEntryDataaccessException;
