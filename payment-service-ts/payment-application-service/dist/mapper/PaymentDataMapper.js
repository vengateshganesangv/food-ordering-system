"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentDataMapper = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
const payment_domain_core_1 = require("@food-ordering-system/payment-domain-core");
const OrderEventPayload_1 = require("../outbox/model/OrderEventPayload");
class PaymentDataMapper {
    paymentRequestModelToPayment(paymentRequest) {
        return payment_domain_core_1.Payment.builder()
            .setOrderId(new common_domain_1.OrderId(paymentRequest.orderId))
            .setCustomerId(new common_domain_1.CustomerId(paymentRequest.customerId))
            .setPrice(new common_domain_1.Money(paymentRequest.price))
            .build();
    }
    paymentEventToOrderEventPayload(paymentEvent) {
        return new OrderEventPayload_1.OrderEventPayload(paymentEvent.getPayment().getId().getValue(), paymentEvent.getPayment().getCustomerId().getValue(), paymentEvent.getPayment().getOrderId().getValue(), paymentEvent.getPayment().getPrice().getAmount(), paymentEvent.getCreatedAt(), paymentEvent.getPayment().getPaymentStatus().toString(), paymentEvent.getFailureMessages());
    }
}
exports.PaymentDataMapper = PaymentDataMapper;
