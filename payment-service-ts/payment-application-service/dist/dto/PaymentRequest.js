"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRequest = void 0;
class PaymentRequest {
    constructor(id, sagaId, orderId, customerId, price, createdAt, paymentOrderStatus) {
        this.id = id;
        this.sagaId = sagaId;
        this.orderId = orderId;
        this.customerId = customerId;
        this.price = price;
        this.createdAt = createdAt;
        this.paymentOrderStatus = paymentOrderStatus;
    }
    setPaymentOrderStatus(paymentOrderStatus) {
        this.paymentOrderStatus = paymentOrderStatus;
    }
}
exports.PaymentRequest = PaymentRequest;
