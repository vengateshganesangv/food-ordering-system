"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditEntryBuilder = exports.CreditEntry = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
class CreditEntry extends common_domain_1.BaseEntity {
    customerId;
    totalCreditAmount;
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
    static builder() {
        return new CreditEntryBuilder();
    }
    // Getters
    getCustomerId() {
        return this.customerId;
    }
    getTotalCreditAmount() {
        return this.totalCreditAmount;
    }
}
exports.CreditEntry = CreditEntry;
class CreditEntryBuilder {
    creditEntryId;
    customerId;
    totalCreditAmount;
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
        if (!this.customerId || !this.totalCreditAmount) {
            throw new Error('CustomerId and TotalCreditAmount are required to build CreditEntry');
        }
        return new CreditEntry({
            creditEntryId: this.creditEntryId,
            customerId: this.customerId,
            totalCreditAmount: this.totalCreditAmount,
        });
    }
}
exports.CreditEntryBuilder = CreditEntryBuilder;
//# sourceMappingURL=CreditEntry.js.map