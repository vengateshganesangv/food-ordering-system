import { RecordMetadata } from 'kafkajs';
import { KafkaProducerCallback } from './service/kafka-producer.interface';
import { OutboxStatus } from '@food-ordering-system/outbox';

/**
 * Kafka Message Helper
 * Provides utility methods for message processing and callback handling
 * Corresponds to Java's KafkaMessageHelper
 */
export class KafkaMessageHelper {
  /**
   * Parse JSON payload into the specified type
   * @param payload - JSON string payload
   * @returns Parsed object
   */
  getOrderEventPayload<T>(payload: string): T {
    try {
      return JSON.parse(payload) as T;
    } catch (error) {
      console.error(`Could not parse payload:`, error);
      throw new Error(`Could not parse payload: ${error}`);
    }
  }

  /**
   * Create a Kafka callback with outbox status handling
   * @param responseTopicName - The topic name for logging
   * @param avroModel - The message being sent
   * @param outboxMessage - The outbox message to update
   * @param outboxCallback - Callback to update outbox status
   * @param orderId - Order ID for logging
   * @param avroModelName - Model name for logging
   * @returns KafkaProducerCallback
   */
  getKafkaCallback<T, U extends { id?: string }>(
    responseTopicName: string,
    avroModel: T,
    outboxMessage: U,
    outboxCallback: (message: U, status: OutboxStatus) => void,
    orderId: string,
    avroModelName: string
  ): KafkaProducerCallback<string, T> {
    return {
      onFailure: (error: Error) => {
        console.error(
          `Error while sending ${avroModelName} with message: ${JSON.stringify(avroModel)} ` +
          `and outbox type: ${outboxMessage.constructor.name} to topic ${responseTopicName}`,
          error
        );
        outboxCallback(outboxMessage, OutboxStatus.FAILED);
      },

      onSuccess: (metadata: RecordMetadata) => {
        console.log(
          `Received successful response from Kafka for order id: ${orderId} ` +
          `Topic: ${metadata.topic} Partition: ${metadata.partition} ` +
          `Offset: ${metadata.offset} Timestamp: ${metadata.timestamp}`
        );
        outboxCallback(outboxMessage, OutboxStatus.COMPLETED);
      },
    };
  }
}
