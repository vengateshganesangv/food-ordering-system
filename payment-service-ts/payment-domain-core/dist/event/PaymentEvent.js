"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentEvent = void 0;
class PaymentEvent {
    constructor(payment, createdAt, failureMessages) {
        this.payment = payment;
        this.createdAt = createdAt;
        this.failureMessages = failureMessages;
    }
    getPayment() {
        return this.payment;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getFailureMessages() {
        return this.failureMessages;
    }
}
exports.PaymentEvent = PaymentEvent;
