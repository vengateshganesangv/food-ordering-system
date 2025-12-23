"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentCompletedEvent = void 0;
const PaymentEvent_1 = require("./PaymentEvent");
class PaymentCompletedEvent extends PaymentEvent_1.PaymentEvent {
    constructor(payment, createdAt) {
        super(payment, createdAt, []);
    }
}
exports.PaymentCompletedEvent = PaymentCompletedEvent;
