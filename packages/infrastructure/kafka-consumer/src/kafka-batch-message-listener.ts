import { EachBatchPayload, EachMessagePayload } from 'kafkajs';
import { IKafkaConsumer, MessageHandler } from './kafka-consumer.interface';

/**
 * Abstract base class for batch message processing
 * Provides a bridge between KafkaJS batch handling and the domain-specific consumer interface
 */
export abstract class KafkaBatchMessageListener<T> implements MessageHandler<T> {
  constructor(private readonly kafkaConsumer: IKafkaConsumer<T>) {}

  /**
   * Handle a batch of messages from Kafka
   * Extracts messages, keys, partitions, and offsets and passes them to the consumer
   */
  async handleBatch(payload: EachBatchPayload): Promise<void> {
    const { batch } = payload;

    if (!batch.messages || batch.messages.length === 0) {
      console.log('Received empty batch, skipping processing');
      return;
    }

    const messages: T[] = [];
    const keys: string[] = [];
    const partitions: number[] = [];
    const offsets: string[] = [];

    for (const message of batch.messages) {
      try {
        const value = message.value?.toString('utf-8');
        if (value) {
          const parsedMessage = this.deserializeMessage(value);
          messages.push(parsedMessage);
          keys.push(message.key?.toString('utf-8') || '');
          partitions.push(batch.partition);
          offsets.push(message.offset);
        }
      } catch (error) {
        console.error(
          `Error deserializing message at offset ${message.offset}:`,
          error
        );
        // Continue processing other messages
      }
    }

    if (messages.length > 0) {
      console.log(
        `Processing batch of ${messages.length} messages from topic: ${batch.topic}, partition: ${batch.partition}`
      );

      try {
        await this.kafkaConsumer.receive(messages, keys, partitions, offsets);
      } catch (error) {
        console.error('Error processing batch:', error);
        throw error; // Re-throw to let KafkaJS handle retry logic
      }
    }
  }

  /**
   * Handle a single message (for non-batch mode)
   */
  async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;

    try {
      const value = message.value?.toString('utf-8');
      if (!value) {
        console.warn('Received message with no value, skipping');
        return;
      }

      const parsedMessage = this.deserializeMessage(value);
      const key = message.key?.toString('utf-8') || '';

      console.log(
        `Processing single message from topic: ${topic}, partition: ${partition}, offset: ${message.offset}`
      );

      await this.kafkaConsumer.receive(
        [parsedMessage],
        [key],
        [partition],
        [message.offset]
      );
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }

  /**
   * Deserialize message - to be implemented by subclasses
   * @param value - Raw message value as string
   * @returns Deserialized message of type T
   */
  protected abstract deserializeMessage(value: string): T;
}
