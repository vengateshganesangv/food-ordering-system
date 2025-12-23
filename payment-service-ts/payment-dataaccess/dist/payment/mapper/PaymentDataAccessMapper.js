"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentDataAccessMapper = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
const payment_domain_core_1 = require("@food-ordering-system/payment-domain-core");
const PaymentEntity_1 = require("../entity/PaymentEntity");
class PaymentDataAccessMapper {
    paymentToPaymentEntity(payment) {
        const entity = new PaymentEntity_1.PaymentEntity();
        entity.id = payment.getId().getValue();
        entity.customerId = payment.getCustomerId().getValue();
        entity.orderId = payment.getOrderId().getValue();
        entity.price = payment.getPrice().getAmount();
        entity.status = payment.getPaymentStatus();
        entity.createdAt = payment.getCreatedAt();
        return entity;
    }
    paymentEntityToPayment(paymentEntity) {
        return payment_domain_core_1.Payment.builder()
            .setPaymentId(new payment_domain_core_1.PaymentId(paymentEntity.id))
            .setCustomerId(new common_domain_1.CustomerId(paymentEntity.customerId))
            .setOrderId(new common_domain_1.OrderId(paymentEntity.orderId))
            .setPrice(new common_domain_1.Money(paymentEntity.price))
            .setPaymentStatus(paymentEntity.status)
            .setCreatedAt(paymentEntity.createdAt)
            .build();
    }
}
exports.PaymentDataAccessMapper = PaymentDataAccessMapper;
