"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderEventPayload = void 0;
class OrderEventPayload {
    paymentId;
    customerId;
    orderId;
    price;
    createdAt;
    paymentStatus;
    failureMessages;
    constructor() { }
    static builder() {
        return new OrderEventPayloadBuilder();
    }
}
exports.OrderEventPayload = OrderEventPayload;
class OrderEventPayloadBuilder {
    payload;
    constructor() {
        this.payload = new OrderEventPayload();
    }
    paymentId(paymentId) {
        this.payload.paymentId = paymentId;
        return this;
    }
    customerId(customerId) {
        this.payload.customerId = customerId;
        return this;
    }
    orderId(orderId) {
        this.payload.orderId = orderId;
        return this;
    }
    price(price) {
        this.payload.price = price;
        return this;
    }
    createdAt(createdAt) {
        this.payload.createdAt = createdAt;
        return this;
    }
    paymentStatus(paymentStatus) {
        this.payload.paymentStatus = paymentStatus;
        return this;
    }
    failureMessages(failureMessages) {
        this.payload.failureMessages = failureMessages;
        return this;
    }
    build() {
        return this.payload;
    }
}
//# sourceMappingURL=OrderEventPayload.js.map