import { RecordMetadata } from 'kafkajs';
import { Logger } from './logger';

/**
 * Outbox status enum
 */
export enum OutboxStatus {
  STARTED = 'STARTED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

/**
 * Outbox message interface
 */
export interface OutboxMessage {
  getId(): string;
  getSagaId(): string;
  getPayload(): string;
  getOutboxStatus(): OutboxStatus;
  setOutboxStatus(status: OutboxStatus): void;
}

/**
 * Helper class for Kafka message operations
 */
export class KafkaMessageHelper {
  private logger = new Logger('KafkaMessageHelper');

  /**
   * Parse JSON payload to typed object
   * @param payload JSON string payload
   * @param outputType Class constructor for the output type
   */
  getOrderEventPayload<T>(payload: string, outputType: new (...args: any[]) => T): T {
    try {
      const parsed = JSON.parse(payload);
      // If outputType has a static fromJSON method, use it
      if (typeof (outputType as any).fromJSON === 'function') {
        return (outputType as any).fromJSON(parsed);
      }
      // Otherwise, construct directly
      return Object.assign(new outputType(), parsed);
    } catch (error) {
      this.logger.error(`Could not read ${outputType.name} object!`, error);
      throw new Error(`Could not read ${outputType.name} object!`);
    }
  }

  /**
   * Create Kafka callback for handling send results
   * @param responseTopicName The topic name for logging
   * @param avroModel The Avro model being sent
   * @param outboxMessage The outbox message to update
   * @param outboxCallback Callback to update outbox status
   * @param orderId Order ID for logging
   * @param avroModelName Model name for logging
   */
  getKafkaCallback<T, U extends OutboxMessage>(
    responseTopicName: string,
    avroModel: T,
    outboxMessage: U,
    outboxCallback: (message: U, status: OutboxStatus) => void,
    orderId: string,
    avroModelName: string
  ): {
    onSuccess: (metadata: RecordMetadata) => void;
    onFailure: (error: Error) => void;
  } {
    return {
      onSuccess: (metadata: RecordMetadata) => {
        this.logger.info(
          `Received successful response from Kafka for order id: ${orderId} ` +
          `Topic: ${metadata.topic} Partition: ${metadata.partition} ` +
          `Offset: ${metadata.offset} Timestamp: ${metadata.timestamp}`
        );
        outboxCallback(outboxMessage, OutboxStatus.COMPLETED);
      },
      onFailure: (error: Error) => {
        this.logger.error(
          `Error while sending ${avroModelName} with message: ${JSON.stringify(avroModel)} ` +
          `and outbox type: ${outboxMessage.constructor.name} to topic ${responseTopicName}`,
          error
        );
        outboxCallback(outboxMessage, OutboxStatus.FAILED);
      }
    };
  }
}
