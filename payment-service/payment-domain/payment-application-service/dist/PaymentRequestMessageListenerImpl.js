"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRequestMessageListenerImpl = void 0;
class PaymentRequestMessageListenerImpl {
    paymentRequestHelper;
    constructor(paymentRequestHelper) {
        this.paymentRequestHelper = paymentRequestHelper;
    }
    async completePayment(paymentRequest) {
        await this.paymentRequestHelper.persistPayment(paymentRequest);
    }
    async cancelPayment(paymentRequest) {
        await this.paymentRequestHelper.persistCancelPayment(paymentRequest);
    }
}
exports.PaymentRequestMessageListenerImpl = PaymentRequestMessageListenerImpl;
//# sourceMappingURL=PaymentRequestMessageListenerImpl.js.map