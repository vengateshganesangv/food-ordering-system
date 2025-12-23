"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditHistoryBuilder = exports.CreditHistory = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
class CreditHistory extends common_domain_1.BaseEntity {
    customerId;
    amount;
    transactionType;
    constructor(props) {
        super();
        if (props.creditHistoryId) {
            this.setId(props.creditHistoryId);
        }
        this.customerId = props.customerId;
        this.amount = props.amount;
        this.transactionType = props.transactionType;
    }
    static builder() {
        return new CreditHistoryBuilder();
    }
    // Getters
    getCustomerId() {
        return this.customerId;
    }
    getAmount() {
        return this.amount;
    }
    getTransactionType() {
        return this.transactionType;
    }
}
exports.CreditHistory = CreditHistory;
class CreditHistoryBuilder {
    creditHistoryId;
    customerId;
    amount;
    transactionType;
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
        if (!this.customerId || !this.amount || !this.transactionType) {
            throw new Error('CustomerId, Amount, and TransactionType are required to build CreditHistory');
        }
        return new CreditHistory({
            creditHistoryId: this.creditHistoryId,
            customerId: this.customerId,
            amount: this.amount,
            transactionType: this.transactionType,
        });
    }
}
exports.CreditHistoryBuilder = CreditHistoryBuilder;
//# sourceMappingURL=CreditHistory.js.map