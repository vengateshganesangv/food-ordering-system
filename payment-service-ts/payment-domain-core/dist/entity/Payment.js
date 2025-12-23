"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
const PaymentId_1 = require("../valueobject/PaymentId");
const uuid_1 = require("uuid");
class Payment extends common_domain_1.AggregateRoot {
    constructor(props) {
        super(props.paymentId);
        this.orderId = props.orderId;
        this.customerId = props.customerId;
        this.price = props.price;
        this.paymentStatus = props.paymentStatus;
        this.createdAt = props.createdAt;
    }
    initializePayment() {
        this.setId(new PaymentId_1.PaymentId((0, uuid_1.v4)()));
        this.createdAt = new Date();
    }
    validatePayment(failureMessages) {
        if (!this.price || !this.price.isGreaterThanZero()) {
            failureMessages.push('Total price must be greater than zero!');
        }
    }
    updateStatus(paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
    getOrderId() {
        return this.orderId;
    }
    getCustomerId() {
        return this.customerId;
    }
    getPrice() {
        return this.price;
    }
    getPaymentStatus() {
        return this.paymentStatus;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    static builder() {
        return new PaymentBuilder();
    }
}
exports.Payment = Payment;
class PaymentBuilder {
    setPaymentId(paymentId) {
        this.paymentId = paymentId;
        return this;
    }
    setOrderId(orderId) {
        this.orderId = orderId;
        return this;
    }
    setCustomerId(customerId) {
        this.customerId = customerId;
        return this;
    }
    setPrice(price) {
        this.price = price;
        return this;
    }
    setPaymentStatus(paymentStatus) {
        this.paymentStatus = paymentStatus;
        return this;
    }
    setCreatedAt(createdAt) {
        this.createdAt = createdAt;
        return this;
    }
    build() {
        return new Payment({
            paymentId: this.paymentId,
            orderId: this.orderId,
            customerId: this.customerId,
            price: this.price,
            paymentStatus: this.paymentStatus,
            createdAt: this.createdAt
        });
    }
}
