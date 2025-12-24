import { Kafka, Producer, ProducerRecord, RecordMetadata, CompressionTypes } from 'kafkajs';
import { IKafkaProducer } from './kafka-producer.interface';
import { KafkaProducerException } from '../exception/kafka-producer-exception';
import { Logger } from '../logger';

/**
 * Kafka producer implementation using KafkaJS
 */
export class KafkaProducerImpl<K, V> implements IKafkaProducer<K, V> {
  private producer: Producer;
  private logger = new Logger('KafkaProducerImpl');
  private isConnected = false;

  constructor(
    private kafka: Kafka,
    private valueSerializer?: (value: V) => Buffer
  ) {
    this.producer = kafka.producer();
  }

  /**
   * Connect to Kafka (lazy initialization)
   */
  private async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.producer.connect();
      this.isConnected = true;
      this.logger.info('Kafka producer connected successfully');
    }
  }

  /**
   * Send message to Kafka topic
   */
  async send(
    topicName: string,
    key: K,
    message: V,
    callback: {
      onSuccess: (metadata: RecordMetadata) => void;
      onFailure: (error: Error) => void;
    }
  ): Promise<void> {
    this.logger.info(`Sending message to topic=${topicName}`, { message });

    try {
      await this.connect();

      // Serialize key and value
      const keyBuffer = this.serializeKey(key);
      const valueBuffer = this.serializeValue(message);

      const record: ProducerRecord = {
        topic: topicName,
        messages: [
          {
            key: keyBuffer,
            value: valueBuffer
          }
        ]
      };

      const result = await this.producer.send(record);

      // KafkaJS returns an array of RecordMetadata
      if (result && result.length > 0) {
        const metadata = result[0];
        callback.onSuccess(metadata);
      }
    } catch (error) {
      this.logger.error(
        `Error on kafka producer with key: ${key}, message: ${JSON.stringify(message)}`,
        error
      );
      const kafkaError = error instanceof Error ? error : new Error(String(error));
      callback.onFailure(kafkaError);
      throw new KafkaProducerException(
        `Error on kafka producer with key: ${key} and message: ${JSON.stringify(message)}`
      );
    }
  }

  /**
   * Serialize key to buffer
   */
  private serializeKey(key: K): Buffer {
    if (typeof key === 'string') {
      return Buffer.from(key);
    }
    return Buffer.from(JSON.stringify(key));
  }

  /**
   * Serialize value to buffer
   */
  private serializeValue(value: V): Buffer {
    if (this.valueSerializer) {
      return this.valueSerializer(value);
    }
    // Default: JSON serialization
    return Buffer.from(JSON.stringify(value));
  }

  /**
   * Disconnect producer
   */
  async disconnect(): Promise<void> {
    if (this.isConnected) {
      this.logger.info('Closing kafka producer!');
      await this.producer.disconnect();
      this.isConnected = false;
    }
  }
}
