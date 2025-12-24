import { OutboxStatus, SagaStatus } from '@food-ordering-system/common-domain';
import { OrderApprovalOutboxMessage } from '../../../outbox/model/approval/OrderApprovalOutboxMessage';

/**
 * Approval Outbox Repository interface
 * Output port for approval outbox persistence
 */
export interface ApprovalOutboxRepository {
  /**
   * Saves an approval outbox message
   * @param orderApprovalOutboxMessage Outbox message to save
   * @returns Saved outbox message
   */
  save(orderApprovalOutboxMessage: OrderApprovalOutboxMessage): Promise<OrderApprovalOutboxMessage>;

  /**
   * Finds outbox messages by type, outbox status, and saga status
   * @param type Saga type
   * @param outboxStatus Outbox status
   * @param sagaStatus Saga statuses (varargs)
   * @returns List of matching outbox messages
   */
  findByTypeAndOutboxStatusAndSagaStatus(
    type: string,
    outboxStatus: OutboxStatus,
    sagaStatus: SagaStatus[],
  ): Promise<OrderApprovalOutboxMessage[] | undefined>;

  /**
   * Finds an outbox message by type, saga ID, and saga status
   * @param type Saga type
   * @param sagaId Saga ID
   * @param sagaStatus Saga statuses (varargs)
   * @returns Matching outbox message
   */
  findByTypeAndSagaIdAndSagaStatus(
    type: string,
    sagaId: string,
    sagaStatus: SagaStatus[],
  ): Promise<OrderApprovalOutboxMessage | undefined>;

  /**
   * Deletes outbox messages by type, outbox status, and saga status
   * @param type Saga type
   * @param outboxStatus Outbox status
   * @param sagaStatus Saga statuses (varargs)
   */
  deleteByTypeAndOutboxStatusAndSagaStatus(
    type: string,
    outboxStatus: OutboxStatus,
    sagaStatus: SagaStatus[],
  ): Promise<void>;
}
