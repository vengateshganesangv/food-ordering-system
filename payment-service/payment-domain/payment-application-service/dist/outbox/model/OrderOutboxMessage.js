"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderOutboxMessage = void 0;
class OrderOutboxMessage {
    id;
    sagaId;
    createdAt;
    processedAt;
    type;
    payload;
    paymentStatus;
    outboxStatus;
    version;
    constructor() { }
    static builder() {
        return new OrderOutboxMessageBuilder();
    }
    setOutboxStatus(outboxStatus) {
        this.outboxStatus = outboxStatus;
    }
}
exports.OrderOutboxMessage = OrderOutboxMessage;
class OrderOutboxMessageBuilder {
    message;
    constructor() {
        this.message = new OrderOutboxMessage();
    }
    id(id) {
        this.message.id = id;
        return this;
    }
    sagaId(sagaId) {
        this.message.sagaId = sagaId;
        return this;
    }
    createdAt(createdAt) {
        this.message.createdAt = createdAt;
        return this;
    }
    processedAt(processedAt) {
        this.message.processedAt = processedAt;
        return this;
    }
    type(type) {
        this.message.type = type;
        return this;
    }
    payload(payload) {
        this.message.payload = payload;
        return this;
    }
    paymentStatus(paymentStatus) {
        this.message.paymentStatus = paymentStatus;
        return this;
    }
    outboxStatus(outboxStatus) {
        this.message.outboxStatus = outboxStatus;
        return this;
    }
    version(version) {
        this.message.version = version;
        return this;
    }
    build() {
        return this.message;
    }
}
//# sourceMappingURL=OrderOutboxMessage.js.map