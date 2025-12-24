import { ApprovalOutboxEntity } from '../entity/ApprovalOutboxEntity';
import { OrderApprovalOutboxMessage } from '@food-ordering-system/order-application-service';

export class ApprovalOutboxDataAccessMapper {
  orderCreatedOutboxMessageToOutboxEntity(
    orderApprovalOutboxMessage: OrderApprovalOutboxMessage,
  ): ApprovalOutboxEntity {
    const entity = new ApprovalOutboxEntity();

    entity.id = orderApprovalOutboxMessage.getId();
    entity.sagaId = orderApprovalOutboxMessage.getSagaId();
    entity.createdAt = orderApprovalOutboxMessage.getCreatedAt();
    entity.type = orderApprovalOutboxMessage.getType();
    entity.payload = orderApprovalOutboxMessage.getPayload();
    entity.orderStatus = orderApprovalOutboxMessage.getOrderStatus();
    entity.sagaStatus = orderApprovalOutboxMessage.getSagaStatus();
    entity.outboxStatus = orderApprovalOutboxMessage.getOutboxStatus();
    entity.version = orderApprovalOutboxMessage.getVersion();

    return entity;
  }

  approvalOutboxEntityToOrderApprovalOutboxMessage(
    approvalOutboxEntity: ApprovalOutboxEntity,
  ): OrderApprovalOutboxMessage {
    return OrderApprovalOutboxMessage.builder()
      .id(approvalOutboxEntity.id)
      .sagaId(approvalOutboxEntity.sagaId)
      .createdAt(approvalOutboxEntity.createdAt)
      .type(approvalOutboxEntity.type)
      .payload(approvalOutboxEntity.payload)
      .orderStatus(approvalOutboxEntity.orderStatus)
      .sagaStatus(approvalOutboxEntity.sagaStatus)
      .outboxStatus(approvalOutboxEntity.outboxStatus)
      .version(approvalOutboxEntity.version)
      .build();
  }
}
