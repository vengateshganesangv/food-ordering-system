"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentEvent = void 0;
class PaymentEvent {
    _phantom;
    payment;
    createdAt;
    failureMessages;
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
//# sourceMappingURL=PaymentEvent.js.map