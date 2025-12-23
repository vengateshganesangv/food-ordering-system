"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderOutboxDataAccessMapper = void 0;
const restaurant_application_service_1 = require("@food-ordering-system/restaurant-application-service");
const OrderOutboxEntity_1 = require("../entity/OrderOutboxEntity");
/**
 * Order Outbox Data Access Mapper
 * Maps between OrderOutboxMessage domain model and OrderOutboxEntity
 */
class OrderOutboxDataAccessMapper {
    /**
     * Convert OrderOutboxMessage to OrderOutboxEntity
     * @param orderOutboxMessage Domain outbox message
     * @returns TypeORM entity
     */
    orderOutboxMessageToOutboxEntity(orderOutboxMessage) {
        const entity = new OrderOutboxEntity_1.OrderOutboxEntity();
        entity.id = orderOutboxMessage.getId();
        entity.sagaId = orderOutboxMessage.getSagaId();
        entity.createdAt = orderOutboxMessage.getCreatedAt();
        entity.processedAt = orderOutboxMessage.getProcessedAt() ?? undefined;
        entity.type = orderOutboxMessage.getType();
        entity.payload = orderOutboxMessage.getPayload();
        entity.outboxStatus = orderOutboxMessage.getOutboxStatus();
        entity.approvalStatus = orderOutboxMessage.getApprovalStatus();
        entity.version = orderOutboxMessage.getVersion();
        return entity;
    }
    /**
     * Convert OrderOutboxEntity to OrderOutboxMessage
     * @param orderOutboxEntity TypeORM entity
     * @returns Domain outbox message
     */
    orderOutboxEntityToOrderOutboxMessage(orderOutboxEntity) {
        return new restaurant_application_service_1.OrderOutboxMessage.Builder()
            .id(orderOutboxEntity.id)
            .sagaId(orderOutboxEntity.sagaId)
            .createdAt(orderOutboxEntity.createdAt)
            .processedAt(orderOutboxEntity.processedAt ?? null)
            .type(orderOutboxEntity.type)
            .payload(orderOutboxEntity.payload)
            .outboxStatus(orderOutboxEntity.outboxStatus)
            .approvalStatus(orderOutboxEntity.approvalStatus)
            .version(orderOutboxEntity.version)
            .build();
    }
}
exports.OrderOutboxDataAccessMapper = OrderOutboxDataAccessMapper;
