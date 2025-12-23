"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderOutboxMessageBuilder = exports.OrderOutboxMessage = void 0;
class OrderOutboxMessage {
    constructor(id, sagaId, createdAt, processedAt, type, payload, paymentStatus, outboxStatus, version) {
        this.id = id;
        this.sagaId = sagaId;
        this.createdAt = createdAt;
        this.processedAt = processedAt;
        this.type = type;
        this.payload = payload;
        this.paymentStatus = paymentStatus;
        this.outboxStatus = outboxStatus;
        this.version = version;
    }
    getId() {
        return this.id;
    }
    getSagaId() {
        return this.sagaId;
    }
    getPayload() {
        return this.payload;
    }
    getOutboxStatus() {
        return this.outboxStatus;
    }
    setOutboxStatus(outboxStatus) {
        this.outboxStatus = outboxStatus;
    }
    static builder() {
        return new OrderOutboxMessageBuilder();
    }
}
exports.OrderOutboxMessage = OrderOutboxMessage;
class OrderOutboxMessageBuilder {
    constructor() {
        this.version = 0;
    }
    setId(id) {
        this.id = id;
        return this;
    }
    setSagaId(sagaId) {
        this.sagaId = sagaId;
        return this;
    }
    setCreatedAt(createdAt) {
        this.createdAt = createdAt;
        return this;
    }
    setProcessedAt(processedAt) {
        this.processedAt = processedAt;
        return this;
    }
    setType(type) {
        this.type = type;
        return this;
    }
    setPayload(payload) {
        this.payload = payload;
        return this;
    }
    setPaymentStatus(paymentStatus) {
        this.paymentStatus = paymentStatus;
        return this;
    }
    setOutboxStatus(outboxStatus) {
        this.outboxStatus = outboxStatus;
        return this;
    }
    setVersion(version) {
        this.version = version;
        return this;
    }
    build() {
        return new OrderOutboxMessage(this.id, this.sagaId, this.createdAt, this.processedAt, this.type, this.payload, this.paymentStatus, this.outboxStatus, this.version);
    }
}
exports.OrderOutboxMessageBuilder = OrderOutboxMessageBuilder;
