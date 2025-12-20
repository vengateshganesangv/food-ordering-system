import { OrderStatus } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { SagaStatus } from '@food-ordering-system/saga';
import { OrderPaymentOutboxMessage } from '../../../outbox/model/payment/OrderPaymentOutboxMessage';

export interface PaymentOutboxRepository {
  save(orderPaymentOutboxMessage: OrderPaymentOutboxMessage): Promise<OrderPaymentOutboxMessage>;

  findByTypeAndOutboxStatusAndSagaStatus(
    type: string,
    outboxStatus: OutboxStatus,
    ...sagaStatus: SagaStatus[]
  ): Promise<OrderPaymentOutboxMessage[]>;

  findByTypeAndSagaIdAndSagaStatus(
    type: string,
    sagaId: string,
    ...sagaStatus: SagaStatus[]
  ): Promise<OrderPaymentOutboxMessage | null>;

  deleteByTypeAndOutboxStatusAndSagaStatus(
    type: string,
    outboxStatus: OutboxStatus,
    ...sagaStatus: SagaStatus[]
  ): Promise<void>;
}
