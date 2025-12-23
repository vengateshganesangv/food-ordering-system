"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentCancelledEvent = void 0;
const PaymentEvent_1 = require("./PaymentEvent");
class PaymentCancelledEvent extends PaymentEvent_1.PaymentEvent {
    constructor(payment, createdAt) {
        super(payment, createdAt, []);
    }
}
exports.PaymentCancelledEvent = PaymentCancelledEvent;
//# sourceMappingURL=PaymentCancelledEvent.js.map