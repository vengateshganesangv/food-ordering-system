import { PaymentStatus, OutboxStatus } from '@food-ordering-system/common-domain';
import { OrderOutboxMessage } from '../../../outbox/model/OrderOutboxMessage';

export interface OrderOutboxRepository {
  save(orderOutboxMessage: OrderOutboxMessage): Promise<OrderOutboxMessage>;

  findByTypeAndOutboxStatus(type: string, status: OutboxStatus): Promise<OrderOutboxMessage[]>;

  findByTypeAndSagaIdAndPaymentStatusAndOutboxStatus(
    type: string,
    sagaId: string,
    paymentStatus: PaymentStatus,
    outboxStatus: OutboxStatus
  ): Promise<OrderOutboxMessage | null>;

  deleteByTypeAndOutboxStatus(type: string, status: OutboxStatus): Promise<void>;
}
