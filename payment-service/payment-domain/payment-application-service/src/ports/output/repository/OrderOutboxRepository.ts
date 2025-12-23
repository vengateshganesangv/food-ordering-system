import { PaymentStatus } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { OrderOutboxMessage } from '../../../outbox/model/OrderOutboxMessage';

export interface OrderOutboxRepository {
  save(orderOutboxMessage: OrderOutboxMessage): Promise<OrderOutboxMessage>;

  findByTypeAndOutboxStatus(type: string, status: OutboxStatus): Promise<OrderOutboxMessage[] | null>;

  findByTypeAndSagaIdAndPaymentStatusAndOutboxStatus(
    type: string,
    sagaId: string,
    paymentStatus: PaymentStatus,
    outboxStatus: OutboxStatus
  ): Promise<OrderOutboxMessage | null>;

  deleteByTypeAndOutboxStatus(type: string, status: OutboxStatus): Promise<void>;
}
