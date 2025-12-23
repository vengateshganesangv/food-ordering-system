"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentBuilder = exports.Payment = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
const PaymentId_1 = require("../valueobject/PaymentId");
const uuid_1 = require("uuid");
class Payment extends common_domain_1.AggregateRoot {
    orderId;
    customerId;
    price;
    paymentStatus;
    createdAt;
    constructor(props) {
        super();
        if (props.paymentId) {
            this.setId(props.paymentId);
        }
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
    static builder() {
        return new PaymentBuilder();
    }
    // Getters
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
}
exports.Payment = Payment;
class PaymentBuilder {
    paymentId;
    orderId;
    customerId;
    price;
    paymentStatus;
    createdAt;
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
        if (!this.orderId || !this.customerId || !this.price) {
            throw new Error('OrderId, CustomerId, and Price are required to build Payment');
        }
        return new Payment({
            paymentId: this.paymentId,
            orderId: this.orderId,
            customerId: this.customerId,
            price: this.price,
            paymentStatus: this.paymentStatus,
            createdAt: this.createdAt,
        });
    }
}
exports.PaymentBuilder = PaymentBuilder;
//# sourceMappingURL=Payment.js.map