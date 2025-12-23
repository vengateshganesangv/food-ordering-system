"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderOutboxDataAccessMapper = void 0;
const payment_application_service_1 = require("@food-ordering-system/payment-application-service");
const OrderOutboxEntity_1 = require("../entity/OrderOutboxEntity");
class OrderOutboxDataAccessMapper {
    orderOutboxMessageToOutboxEntity(orderOutboxMessage) {
        const entity = new OrderOutboxEntity_1.OrderOutboxEntity();
        entity.id = orderOutboxMessage.id;
        entity.sagaId = orderOutboxMessage.sagaId;
        entity.createdAt = orderOutboxMessage.createdAt;
        entity.processedAt = orderOutboxMessage.processedAt;
        entity.type = orderOutboxMessage.type;
        entity.payload = orderOutboxMessage.payload;
        entity.outboxStatus = orderOutboxMessage.outboxStatus;
        entity.paymentStatus = orderOutboxMessage.paymentStatus;
        entity.version = orderOutboxMessage.version;
        return entity;
    }
    orderOutboxEntityToOrderOutboxMessage(orderOutboxEntity) {
        return payment_application_service_1.OrderOutboxMessage.builder()
            .setId(orderOutboxEntity.id)
            .setSagaId(orderOutboxEntity.sagaId)
            .setCreatedAt(orderOutboxEntity.createdAt)
            .setProcessedAt(orderOutboxEntity.processedAt)
            .setType(orderOutboxEntity.type)
            .setPayload(orderOutboxEntity.payload)
            .setOutboxStatus(orderOutboxEntity.outboxStatus)
            .setPaymentStatus(orderOutboxEntity.paymentStatus)
            .setVersion(orderOutboxEntity.version)
            .build();
    }
}
exports.OrderOutboxDataAccessMapper = OrderOutboxDataAccessMapper;
