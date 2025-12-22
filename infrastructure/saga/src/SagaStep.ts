/**
 * Interface representing a single step in a SAGA transaction.
 *
 * Each SAGA step encapsulates a local transaction along with its compensating
 * transaction (rollback). The process method executes the forward transaction,
 * while the rollback method executes the compensating transaction.
 *
 * @template T The type of data that flows through the SAGA step
 *
 * @example
 * ```typescript
 * class PaymentSagaStep implements SagaStep<OrderPaymentData> {
 *   process(data: OrderPaymentData): void {
 *     // Process payment
 *   }
 *
 *   rollback(data: OrderPaymentData): void {
 *     // Refund payment
 *   }
 * }
 * ```
 */
export interface SagaStep<T> {
  /**
   * Executes the forward transaction for this step.
   *
   * @param data - The data needed to execute this step
   * @throws Error if the step fails to complete
   */
  process(data: T): void;

  /**
   * Executes the compensating transaction for this step.
   * This is called when a later step fails and the SAGA needs to rollback.
   *
   * @param data - The data needed to rollback this step
   * @throws Error if the rollback fails
   */
  rollback(data: T): void;
}
