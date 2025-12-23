import { OrderOutboxMessage } from '@food-ordering-system/restaurant-application-service';
import { OrderOutboxEntity } from '../entity/OrderOutboxEntity';

/**
 * Order Outbox Data Access Mapper
 * Maps between OrderOutboxMessage domain model and OrderOutboxEntity
 */
export class OrderOutboxDataAccessMapper {
  /**
   * Convert OrderOutboxMessage to OrderOutboxEntity
   * @param orderOutboxMessage Domain outbox message
   * @returns TypeORM entity
   */
  orderOutboxMessageToOutboxEntity(orderOutboxMessage: OrderOutboxMessage): OrderOutboxEntity {
    const entity = new OrderOutboxEntity();
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
  orderOutboxEntityToOrderOutboxMessage(orderOutboxEntity: OrderOutboxEntity): OrderOutboxMessage {
    return new OrderOutboxMessage.Builder()
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
