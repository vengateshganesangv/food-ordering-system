import { Kafka, Producer, RecordMetadata, CompressionTypes } from 'kafkajs';
import { IKafkaProducer, KafkaProducerCallback } from './kafka-producer.interface';
import { KafkaProducerException } from '../exception/kafka-producer.exception';
import { KafkaConfigData, KafkaProducerConfigData } from '@food-ordering-system/kafka-config-data';

/**
 * Kafka Producer implementation using KafkaJS
 * Corresponds to Java's KafkaProducerImpl
 */
export class KafkaProducerImpl<K, V> implements IKafkaProducer<K, V> {
  private producer: Producer;
  private readonly config: KafkaProducerConfigData;

  constructor(
    private readonly kafkaConfig: KafkaConfigData,
    private readonly producerConfig: KafkaProducerConfigData
  ) {
    this.config = producerConfig;
    const kafka = new Kafka({
      clientId: 'food-ordering-system-producer',
      brokers: kafkaConfig.bootstrapServers.split(','),
      retry: {
        retries: producerConfig.retryCount,
      },
    });

    this.producer = kafka.producer({
      allowAutoTopicCreation: false,
      transactionTimeout: producerConfig.requestTimeoutMs,
      idempotent: producerConfig.acks === -1 || producerConfig.acks === 'all',
      maxInFlightRequests: 5,
      compression: this.mapCompressionType(producerConfig.compressionType),
    });
  }

  /**
   * Initialize the producer connection
   */
  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      console.log('Kafka producer connected successfully');
    } catch (error) {
      console.error('Error connecting Kafka producer:', error);
      throw new KafkaProducerException(`Failed to connect Kafka producer: ${error}`);
    }
  }

  /**
   * Send a message to a Kafka topic
   */
  async send(
    topicName: string,
    key: K,
    message: V,
    callback: KafkaProducerCallback<K, V>
  ): Promise<void> {
    console.log(`Sending message to topic=${topicName}`, message);

    try {
      const result = await this.producer.send({
        topic: topicName,
        messages: [
          {
            key: this.serializeKey(key),
            value: this.serializeValue(message),
          },
        ],
        acks: this.mapAcks(this.config.acks),
        timeout: this.config.requestTimeoutMs,
        compression: this.mapCompressionType(this.config.compressionType),
      });

      // KafkaJS returns an array of RecordMetadata
      if (result && result.length > 0) {
        const metadata = result[0];
        callback.onSuccess({
          topic: metadata.topicName,
          partition: metadata.partition,
          offset: metadata.baseOffset,
          timestamp: metadata.logAppendTime || Date.now().toString(),
        } as RecordMetadata);
      }
    } catch (error) {
      console.error(
        `Error on kafka producer with key: ${key}, message: ${JSON.stringify(message)}`,
        error
      );
      callback.onFailure(
        error instanceof Error
          ? error
          : new KafkaProducerException(`Error on kafka producer with key: ${key} and message: ${message}`)
      );
    }
  }

  /**
   * Close the producer connection
   */
  async close(): Promise<void> {
    if (this.producer) {
      console.log('Closing kafka producer!');
      await this.producer.disconnect();
    }
  }

  /**
   * Serialize the message key
   */
  private serializeKey(key: K): string {
    if (typeof key === 'string') {
      return key;
    }
    return JSON.stringify(key);
  }

  /**
   * Serialize the message value
   */
  private serializeValue(value: V): string {
    if (typeof value === 'string') {
      return value;
    }
    return JSON.stringify(value);
  }

  /**
   * Map compression type from config to KafkaJS CompressionTypes
   */
  private mapCompressionType(type: string): CompressionTypes {
    switch (type.toLowerCase()) {
      case 'gzip':
        return CompressionTypes.GZIP;
      case 'snappy':
        return CompressionTypes.Snappy;
      case 'lz4':
        return CompressionTypes.LZ4;
      case 'zstd':
        return CompressionTypes.ZSTD;
      case 'none':
      default:
        return CompressionTypes.None;
    }
  }

  /**
   * Map acks configuration
   */
  private mapAcks(acks: -1 | 0 | 1 | 'all'): -1 | 0 | 1 {
    if (acks === 'all') {
      return -1;
    }
    return acks;
  }
}
