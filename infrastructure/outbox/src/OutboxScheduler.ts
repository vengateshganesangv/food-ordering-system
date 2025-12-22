/**
 * Interface for implementing outbox message schedulers.
 *
 * The Outbox Scheduler is responsible for periodically processing outbox messages
 * that are waiting to be published to the message broker. Implementations of this
 * interface should handle the retrieval and publishing of outbox messages.
 *
 * @example
 * ```typescript
 * class PaymentOutboxScheduler implements OutboxScheduler {
 *   processOutboxMessage(): void {
 *     // Fetch pending outbox messages from the database
 *     // Publish messages to the message broker
 *     // Update message status to COMPLETED or FAILED
 *   }
 * }
 * ```
 */
export interface OutboxScheduler {
  /**
   * Processes outbox messages by retrieving them from the database
   * and publishing them to the message broker.
   *
   * This method should:
   * 1. Fetch messages with STARTED or FAILED status
   * 2. Attempt to publish them to the message broker
   * 3. Update the message status to COMPLETED on success or FAILED on error
   *
   * @throws Error if critical failures occur during processing
   */
  processOutboxMessage(): void;
}
