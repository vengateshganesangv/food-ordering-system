"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRequestMessageListenerImpl = void 0;
const kafka_producer_1 = require("@food-ordering-system/kafka-producer");
const logger = new kafka_producer_1.Logger('PaymentRequestMessageListenerImpl');
class PaymentRequestMessageListenerImpl {
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
