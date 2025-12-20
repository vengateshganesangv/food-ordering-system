import { OrderOutboxMessage } from '../../../outbox/OrderOutboxMessage';
import { OrderApprovalStatus } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';

export interface OrderOutboxRepository {
  save(orderOutboxMessage: OrderOutboxMessage): Promise<OrderOutboxMessage>;
  findByTypeAndOutboxStatus(type: string, outboxStatus: OutboxStatus): Promise<OrderOutboxMessage[]>;
  findByTypeAndSagaIdAndApprovalStatusAndOutboxStatus(
    type: string,
    sagaId: string,
    approvalStatus: OrderApprovalStatus,
    outboxStatus: OutboxStatus
  ): Promise<OrderOutboxMessage | null>;
  deleteByTypeAndOutboxStatus(type: string, outboxStatus: OutboxStatus): Promise<void>;
}
