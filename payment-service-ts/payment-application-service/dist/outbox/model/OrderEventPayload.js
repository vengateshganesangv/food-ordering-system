"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderEventPayload = void 0;
class OrderEventPayload {
    constructor(paymentId, customerId, orderId, price, createdAt, paymentStatus, failureMessages) {
        this.paymentId = paymentId;
        this.customerId = customerId;
        this.orderId = orderId;
        this.price = price;
        this.createdAt = createdAt;
        this.paymentStatus = paymentStatus;
        this.failureMessages = failureMessages;
    }
}
exports.OrderEventPayload = OrderEventPayload;
