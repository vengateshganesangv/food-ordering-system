import { EachBatchPayload, EachMessagePayload } from 'kafkajs';

/**
 * Kafka Consumer interface for batch message processing
 * Corresponds to Java's KafkaConsumer interface
 */
export interface IKafkaConsumer<T> {
  /**
   * Receive and process messages in batch
   * @param messages - Array of messages
   * @param keys - Array of message keys
   * @param partitions - Array of partition numbers
   * @param offsets - Array of message offsets
   */
  receive(
    messages: T[],
    keys: string[],
    partitions: number[],
    offsets: string[]
  ): Promise<void>;
}

/**
 * Message handler interface for processing Kafka messages
 */
export interface MessageHandler<T> {
  /**
   * Handle a single message
   */
  handleMessage(payload: EachMessagePayload): Promise<void>;

  /**
   * Handle a batch of messages
   */
  handleBatch(payload: EachBatchPayload): Promise<void>;
}

/**
 * Consumer configuration interface
 */
export interface ConsumerConfig {
  groupId: string;
  topics: string[];
  fromBeginning?: boolean;
  sessionTimeout?: number;
  heartbeatInterval?: number;
  maxBytes?: number;
  maxWaitTimeInMs?: number;
}
