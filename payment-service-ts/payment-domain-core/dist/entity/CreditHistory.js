"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditHistory = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
class CreditHistory extends common_domain_1.BaseEntity {
    constructor(props) {
        super();
        if (props.creditHistoryId) {
            this.setId(props.creditHistoryId);
        }
        this.customerId = props.customerId;
        this.amount = props.amount;
        this.transactionType = props.transactionType;
    }
    getCustomerId() {
        return this.customerId;
    }
    getAmount() {
        return this.amount;
    }
    getTransactionType() {
        return this.transactionType;
    }
    static builder() {
        return new CreditHistory.Builder();
    }
}
exports.CreditHistory = CreditHistory;
CreditHistory.Builder = class {
    setCreditHistoryId(creditHistoryId) {
        this.creditHistoryId = creditHistoryId;
        return this;
    }
    setCustomerId(customerId) {
        this.customerId = customerId;
        return this;
    }
    setAmount(amount) {
        this.amount = amount;
        return this;
    }
    setTransactionType(transactionType) {
        this.transactionType = transactionType;
        return this;
    }
    build() {
        return new CreditHistory({
            creditHistoryId: this.creditHistoryId,
            customerId: this.customerId,
            amount: this.amount,
            transactionType: this.transactionType
        });
    }
};
