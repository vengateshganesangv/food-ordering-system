import { OrderPaymentOutboxMessage } from '@food-ordering-system/order-application-service';
import { PaymentOutboxEntity } from '../entity/PaymentOutboxEntity';

export class PaymentOutboxDataAccessMapper {
  orderPaymentOutboxMessageToOutboxEntity(orderPaymentOutboxMessage: OrderPaymentOutboxMessage): PaymentOutboxEntity {
    const entity = new PaymentOutboxEntity();
    entity.id = orderPaymentOutboxMessage.getId();
    entity.sagaId = orderPaymentOutboxMessage.getSagaId();
    entity.createdAt = orderPaymentOutboxMessage.getCreatedAt();
    entity.processedAt = orderPaymentOutboxMessage.getProcessedAt();
    entity.type = orderPaymentOutboxMessage.getType();
    entity.payload = orderPaymentOutboxMessage.getPayload();
    entity.orderStatus = orderPaymentOutboxMessage.getOrderStatus();
    entity.sagaStatus = orderPaymentOutboxMessage.getSagaStatus();
    entity.outboxStatus = orderPaymentOutboxMessage.getOutboxStatus();
    entity.version = orderPaymentOutboxMessage.getVersion();
    return entity;
  }

  paymentOutboxEntityToOrderPaymentOutboxMessage(paymentOutboxEntity: PaymentOutboxEntity): OrderPaymentOutboxMessage {
    return OrderPaymentOutboxMessage.builder()
      .id(paymentOutboxEntity.id)
      .sagaId(paymentOutboxEntity.sagaId)
      .createdAt(paymentOutboxEntity.createdAt)
      .processedAt(paymentOutboxEntity.processedAt)
      .type(paymentOutboxEntity.type)
      .payload(paymentOutboxEntity.payload)
      .orderStatus(paymentOutboxEntity.orderStatus)
      .sagaStatus(paymentOutboxEntity.sagaStatus)
      .outboxStatus(paymentOutboxEntity.outboxStatus)
      .version(paymentOutboxEntity.version)
      .build();
  }
}
