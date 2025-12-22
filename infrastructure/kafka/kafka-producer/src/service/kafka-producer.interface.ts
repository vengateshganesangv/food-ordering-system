import { RecordMetadata } from 'kafkajs';

/**
 * Kafka producer interface for sending messages
 * Generic type K for key (typically string), V for value (Avro model)
 */
export interface IKafkaProducer<K, V> {
  /**
   * Send message to Kafka topic
   * @param topicName The name of the topic
   * @param key The message key
   * @param message The message value (Avro model)
   * @param callback Callback function for handling success/failure
   */
  send(
    topicName: string,
    key: K,
    message: V,
    callback: {
      onSuccess: (metadata: RecordMetadata) => void;
      onFailure: (error: Error) => void;
    }
  ): Promise<void>;

  /**
   * Disconnect the producer
   */
  disconnect(): Promise<void>;
}
