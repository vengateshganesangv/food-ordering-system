import { OutboxStatus } from '@food-ordering-system/outbox';
import { SagaStatus } from '@food-ordering-system/saga';
import { OrderPaymentOutboxMessage } from '../../../outbox/model/payment/OrderPaymentOutboxMessage';

/**
 * Payment Outbox Repository interface
 * Output port for payment outbox persistence
 */
export interface PaymentOutboxRepository {
  /**
   * Saves a payment outbox message
   * @param orderPaymentOutboxMessage Outbox message to save
   * @returns Saved outbox message
   */
  save(orderPaymentOutboxMessage: OrderPaymentOutboxMessage): Promise<OrderPaymentOutboxMessage>;

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
  ): Promise<OrderPaymentOutboxMessage[] | undefined>;

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
  ): Promise<OrderPaymentOutboxMessage | undefined>;

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
