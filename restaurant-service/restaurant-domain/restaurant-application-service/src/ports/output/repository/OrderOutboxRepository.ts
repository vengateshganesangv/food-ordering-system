import { OutboxStatus } from '@food-ordering-system/outbox';
import { OrderOutboxMessage } from '../../../outbox/model/OrderOutboxMessage';

/**
 * Order Outbox Repository (Output Port)
 * Interface for persisting and querying outbox messages
 */
export interface OrderOutboxRepository {
  /**
   * Save outbox message
   * @param orderOutboxMessage The outbox message to save
   * @returns The saved outbox message
   */
  save(orderOutboxMessage: OrderOutboxMessage): Promise<OrderOutboxMessage | null>;

  /**
   * Find outbox messages by type and status
   * @param type The message type (e.g., OrderProcessingSaga)
   * @param outboxStatus The outbox status to filter by
   * @returns List of matching outbox messages
   */
  findByTypeAndOutboxStatus(
    type: string,
    outboxStatus: OutboxStatus,
  ): Promise<OrderOutboxMessage[] | undefined>;

  /**
   * Find outbox message by type, saga ID, and status
   * @param type The message type
   * @param sagaId The saga ID
   * @param outboxStatus The outbox status
   * @returns The matching outbox message if found
   */
  findByTypeAndSagaIdAndOutboxStatus(
    type: string,
    sagaId: string,
    outboxStatus: OutboxStatus,
  ): Promise<OrderOutboxMessage | undefined>;

  /**
   * Delete outbox messages by type and status
   * @param type The message type
   * @param outboxStatus The outbox status
   */
  deleteByTypeAndOutboxStatus(type: string, outboxStatus: OutboxStatus): Promise<void>;
}
