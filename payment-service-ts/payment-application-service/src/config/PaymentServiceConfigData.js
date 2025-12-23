"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentServiceConfigData = void 0;
class PaymentServiceConfigData {
    constructor(paymentRequestTopicName, paymentResponseTopicName, outboxSchedulerFixedRate, outboxSchedulerInitialDelay) {
        this.paymentRequestTopicName = paymentRequestTopicName;
        this.paymentResponseTopicName = paymentResponseTopicName;
        this.outboxSchedulerFixedRate = outboxSchedulerFixedRate;
        this.outboxSchedulerInitialDelay = outboxSchedulerInitialDelay;
    }
}
exports.PaymentServiceConfigData = PaymentServiceConfigData;
