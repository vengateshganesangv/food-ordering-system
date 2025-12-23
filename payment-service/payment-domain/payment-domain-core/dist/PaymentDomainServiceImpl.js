"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentDomainServiceImpl = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
const CreditHistory_1 = require("./entity/CreditHistory");
const PaymentCompletedEvent_1 = require("./event/PaymentCompletedEvent");
const PaymentCancelledEvent_1 = require("./event/PaymentCancelledEvent");
const PaymentFailedEvent_1 = require("./event/PaymentFailedEvent");
const CreditHistoryId_1 = require("./valueobject/CreditHistoryId");
const TransactionType_1 = require("./valueobject/TransactionType");
const uuid_1 = require("uuid");
class PaymentDomainServiceImpl {
    validateAndInitiatePayment(payment, creditEntry, creditHistories, failureMessages) {
        payment.validatePayment(failureMessages);
        payment.initializePayment();
        this.validateCreditEntry(payment, creditEntry, failureMessages);
        this.subtractCreditEntry(payment, creditEntry);
        this.updateCreditHistory(payment, creditHistories, TransactionType_1.TransactionType.DEBIT);
        this.validateCreditHistory(creditEntry, creditHistories, failureMessages);
        if (failureMessages.length === 0) {
            console.log(`Payment is initiated for order id: ${payment.getOrderId().getValue()}`);
            payment.updateStatus(common_domain_1.PaymentStatus.COMPLETED);
            return new PaymentCompletedEvent_1.PaymentCompletedEvent(payment, new Date());
        }
        else {
            console.log(`Payment initiation is failed for order id: ${payment.getOrderId().getValue()}`);
            payment.updateStatus(common_domain_1.PaymentStatus.FAILED);
            return new PaymentFailedEvent_1.PaymentFailedEvent(payment, new Date(), failureMessages);
        }
    }
    validateAndCancelPayment(payment, creditEntry, creditHistories, failureMessages) {
        payment.validatePayment(failureMessages);
        this.addCreditEntry(payment, creditEntry);
        this.updateCreditHistory(payment, creditHistories, TransactionType_1.TransactionType.CREDIT);
        if (failureMessages.length === 0) {
            console.log(`Payment is cancelled for order id: ${payment.getOrderId().getValue()}`);
            payment.updateStatus(common_domain_1.PaymentStatus.CANCELLED);
            return new PaymentCancelledEvent_1.PaymentCancelledEvent(payment, new Date());
        }
        else {
            console.log(`Payment cancellation is failed for order id: ${payment.getOrderId().getValue()}`);
            payment.updateStatus(common_domain_1.PaymentStatus.FAILED);
            return new PaymentFailedEvent_1.PaymentFailedEvent(payment, new Date(), failureMessages);
        }
    }
    validateCreditEntry(payment, creditEntry, failureMessages) {
        if (payment.getPrice().isGreaterThan(creditEntry.getTotalCreditAmount())) {
            console.error(`Customer with id: ${payment.getCustomerId().getValue()} doesn't have enough credit for payment!`);
            failureMessages.push(`Customer with id=${payment.getCustomerId().getValue()} doesn't have enough credit for payment!`);
        }
    }
    subtractCreditEntry(payment, creditEntry) {
        creditEntry.subtractCreditAmount(payment.getPrice());
    }
    updateCreditHistory(payment, creditHistories, transactionType) {
        const creditHistory = CreditHistory_1.CreditHistory.builder()
            .setCreditHistoryId(new CreditHistoryId_1.CreditHistoryId((0, uuid_1.v4)()))
            .setCustomerId(payment.getCustomerId())
            .setAmount(payment.getPrice())
            .setTransactionType(transactionType)
            .build();
        creditHistories.push(creditHistory);
    }
    validateCreditHistory(creditEntry, creditHistories, failureMessages) {
        const totalCreditHistory = this.getTotalHistoryAmount(creditHistories, TransactionType_1.TransactionType.CREDIT);
        const totalDebitHistory = this.getTotalHistoryAmount(creditHistories, TransactionType_1.TransactionType.DEBIT);
        if (totalDebitHistory.isGreaterThan(totalCreditHistory)) {
            console.error(`Customer with id: ${creditEntry.getCustomerId().getValue()} doesn't have enough credit according to credit history`);
            failureMessages.push(`Customer with id=${creditEntry.getCustomerId().getValue()} doesn't have enough credit according to credit history!`);
        }
        if (!creditEntry.getTotalCreditAmount().equals(totalCreditHistory.subtract(totalDebitHistory))) {
            console.error(`Credit history total is not equal to current credit for customer id: ${creditEntry.getCustomerId().getValue()}!`);
            failureMessages.push(`Credit history total is not equal to current credit for customer id: ${creditEntry.getCustomerId().getValue()}!`);
        }
    }
    getTotalHistoryAmount(creditHistories, transactionType) {
        return creditHistories
            .filter((creditHistory) => transactionType === creditHistory.getTransactionType())
            .map((creditHistory) => creditHistory.getAmount())
            .reduce((acc, amount) => acc.add(amount), common_domain_1.Money.ZERO);
    }
    addCreditEntry(payment, creditEntry) {
        creditEntry.addCreditAmount(payment.getPrice());
    }
}
exports.PaymentDomainServiceImpl = PaymentDomainServiceImpl;
//# sourceMappingURL=PaymentDomainServiceImpl.js.map