"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMessagingDataMapper = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
const payment_application_service_1 = require("@food-ordering-system/payment-application-service");
const uuid_1 = require("uuid");
class PaymentMessagingDataMapper {
    paymentRequestAvroModelToPaymentRequest(paymentRequestAvroModel) {
        return new payment_application_service_1.PaymentRequest(paymentRequestAvroModel.id, paymentRequestAvroModel.sagaId, paymentRequestAvroModel.orderId, paymentRequestAvroModel.customerId, paymentRequestAvroModel.price, paymentRequestAvroModel.createdAt, common_domain_1.PaymentOrderStatus[paymentRequestAvroModel.paymentOrderStatus]);
    }
    orderEventPayloadToPaymentResponseAvroModel(sagaId, orderEventPayload) {
        return {
            id: (0, uuid_1.v4)(),
            sagaId,
            paymentId: orderEventPayload.paymentId,
            customerId: orderEventPayload.customerId,
            orderId: orderEventPayload.orderId,
            price: orderEventPayload.price,
            createdAt: orderEventPayload.createdAt,
            paymentStatus: orderEventPayload.paymentStatus,
            failureMessages: orderEventPayload.failureMessages
        };
    }
}
exports.PaymentMessagingDataMapper = PaymentMessagingDataMapper;
