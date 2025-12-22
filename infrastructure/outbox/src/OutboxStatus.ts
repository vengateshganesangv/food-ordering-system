/**
 * Enum representing the status of an outbox message.
 *
 * The Outbox pattern ensures reliable message publishing by storing messages
 * in a database table (outbox) before publishing them to a message broker.
 * This enum tracks the lifecycle of each outbox message.
 *
 * @enum {string}
 */
export enum OutboxStatus {
  /**
   * The outbox message has been created and is ready for processing
   */
  STARTED = 'STARTED',

  /**
   * The outbox message has been successfully published to the message broker
   */
  COMPLETED = 'COMPLETED',

  /**
   * The outbox message failed to be published and may need retry or manual intervention
   */
  FAILED = 'FAILED'
}
