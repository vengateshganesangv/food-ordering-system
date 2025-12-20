import { RecordMetadata } from 'kafkajs';

/**
 * Kafka Producer interface
 * Corresponds to Java's KafkaProducer interface
 */
export interface IKafkaProducer<K, V> {
  /**
   * Send a message to a Kafka topic
   * @param topicName - The name of the topic to send the message to
   * @param key - The message key
   * @param message - The message value
   * @param callback - Callback function for success/failure handling
   */
  send(
    topicName: string,
    key: K,
    message: V,
    callback: KafkaProducerCallback<K, V>
  ): Promise<void>;

  /**
   * Close the producer connection
   */
  close(): Promise<void>;
}

/**
 * Callback interface for Kafka producer
 */
export interface KafkaProducerCallback<K, V> {
  onSuccess: (result: RecordMetadata) => void;
  onFailure: (error: Error) => void;
}
