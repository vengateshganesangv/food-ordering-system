import { OrderStatus } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { SagaStatus } from '@food-ordering-system/saga';
import { OrderApprovalOutboxMessage } from '../../../outbox/model/approval/OrderApprovalOutboxMessage';

export interface ApprovalOutboxRepository {
  save(orderApprovalOutboxMessage: OrderApprovalOutboxMessage): Promise<OrderApprovalOutboxMessage>;

  findByTypeAndOutboxStatusAndSagaStatus(
    type: string,
    outboxStatus: OutboxStatus,
    ...sagaStatus: SagaStatus[]
  ): Promise<OrderApprovalOutboxMessage[]>;

  findByTypeAndSagaIdAndSagaStatus(
    type: string,
    sagaId: string,
    ...sagaStatus: SagaStatus[]
  ): Promise<OrderApprovalOutboxMessage | null>;

  deleteByTypeAndOutboxStatusAndSagaStatus(
    type: string,
    outboxStatus: OutboxStatus,
    ...sagaStatus: SagaStatus[]
  ): Promise<void>;
}
