import { OrderOutboxMessage } from '../../../outbox/OrderOutboxMessage';
import { PaymentStatus } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';

export interface OrderOutboxRepository {
  save(orderOutboxMessage: OrderOutboxMessage): Promise<OrderOutboxMessage>;
  findByTypeAndOutboxStatus(type: string, outboxStatus: OutboxStatus): Promise<OrderOutboxMessage[]>;
  findByTypeAndSagaIdAndPaymentStatusAndOutboxStatus(
    type: string,
    sagaId: string,
    paymentStatus: PaymentStatus,
    outboxStatus: OutboxStatus
  ): Promise<OrderOutboxMessage | null>;
  deleteByTypeAndOutboxStatus(type: string, outboxStatus: OutboxStatus): Promise<void>;
}
