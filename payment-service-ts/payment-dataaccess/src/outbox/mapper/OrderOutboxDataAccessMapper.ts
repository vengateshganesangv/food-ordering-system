import { OrderOutboxMessage } from '@food-ordering-system/payment-application-service';
import { OrderOutboxEntity } from '../entity/OrderOutboxEntity';

export class OrderOutboxDataAccessMapper {
  public orderOutboxMessageToOutboxEntity(orderOutboxMessage: OrderOutboxMessage): OrderOutboxEntity {
    const entity = new OrderOutboxEntity();
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

  public orderOutboxEntityToOrderOutboxMessage(orderOutboxEntity: OrderOutboxEntity): OrderOutboxMessage {
    return OrderOutboxMessage.builder()
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
