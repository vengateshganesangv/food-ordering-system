"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditEntry = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
class CreditEntry extends common_domain_1.BaseEntity {
    constructor(props) {
        super();
        if (props.creditEntryId) {
            this.setId(props.creditEntryId);
        }
        this.customerId = props.customerId;
        this.totalCreditAmount = props.totalCreditAmount;
    }
    addCreditAmount(amount) {
        this.totalCreditAmount = this.totalCreditAmount.add(amount);
    }
    subtractCreditAmount(amount) {
        this.totalCreditAmount = this.totalCreditAmount.subtract(amount);
    }
    getCustomerId() {
        return this.customerId;
    }
    getTotalCreditAmount() {
        return this.totalCreditAmount;
    }
    static builder() {
        return new CreditEntry.Builder();
    }
}
exports.CreditEntry = CreditEntry;
CreditEntry.Builder = class {
    setCreditEntryId(creditEntryId) {
        this.creditEntryId = creditEntryId;
        return this;
    }
    setCustomerId(customerId) {
        this.customerId = customerId;
        return this;
    }
    setTotalCreditAmount(totalCreditAmount) {
        this.totalCreditAmount = totalCreditAmount;
        return this;
    }
    build() {
        return new CreditEntry({
            creditEntryId: this.creditEntryId,
            customerId: this.customerId,
            totalCreditAmount: this.totalCreditAmount
        });
    }
};
