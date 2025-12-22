/**
 * Kafka consumer interface for receiving messages
 * Generic type T for Avro model
 */
export interface IKafkaConsumer<T> {
  /**
   * Receive and process messages from Kafka
   * @param messages Array of deserialized messages
   * @param keys Array of message keys
   * @param partitions Array of partition numbers
   * @param offsets Array of message offsets
   */
  receive(
    messages: T[],
    keys: string[],
    partitions: number[],
    offsets: number[]
  ): Promise<void>;
}
