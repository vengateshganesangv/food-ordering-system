"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentFailedEvent = void 0;
const PaymentEvent_1 = require("./PaymentEvent");
class PaymentFailedEvent extends PaymentEvent_1.PaymentEvent {
    constructor(payment, createdAt, failureMessages) {
        super(payment, createdAt, failureMessages);
    }
}
exports.PaymentFailedEvent = PaymentFailedEvent;
