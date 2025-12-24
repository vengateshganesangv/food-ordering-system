import { Kafka, CompressionTypes, logLevel } from 'kafkajs';
import { KafkaConfigData, KafkaProducerConfigData } from '@food-ordering-system/kafka-config-data';
import { KafkaProducerImpl } from './service/kafka-producer-impl';
import { Logger } from './logger';

/**
 * Kafka producer configuration
 * Creates and configures Kafka producer instances
 */
export class KafkaProducerConfig<K, V> {
  private logger = new Logger('KafkaProducerConfig');

  constructor(
    private kafkaConfigData: KafkaConfigData,
    private kafkaProducerConfigData: KafkaProducerConfigData
  ) {}

  /**
   * Create producer configuration object for KafkaJS
   */
  getProducerConfig(): any {
    const compressionType = this.getCompressionType(
      this.kafkaProducerConfigData.getCompressionType()
    );

    return {
      retry: {
        retries: this.kafkaProducerConfigData.getRetryCount(),
        initialRetryTime: 100,
        factor: 2,
        multiplier: 2,
        maxRetryTime: this.kafkaProducerConfigData.getRequestTimeoutMs()
      },
      compression: compressionType,
      idempotent: this.kafkaProducerConfigData.getAcks() === 'all',
      maxInFlightRequests: this.kafkaProducerConfigData.getAcks() === 'all' ? 5 : 1,
      transactionalId: undefined,
      allowAutoTopicCreation: false,
      requestTimeout: this.kafkaProducerConfigData.getRequestTimeoutMs()
    };
  }

  /**
   * Create Kafka instance
   */
  createKafka(): Kafka {
    const brokers = this.kafkaConfigData.getBootstrapServers().split(',');

    return new Kafka({
      clientId: 'food-ordering-producer',
      brokers: brokers,
      logLevel: logLevel.INFO,
      retry: {
        retries: this.kafkaProducerConfigData.getRetryCount(),
        initialRetryTime: 100
      },
      // Add schema registry configuration if needed
      // This would require additional library like @kafkajs/confluent-schema-registry
    });
  }

  /**
   * Create producer instance
   */
  createProducer(valueSerializer?: (value: V) => Buffer): KafkaProducerImpl<K, V> {
    const kafka = this.createKafka();
    return new KafkaProducerImpl<K, V>(kafka, valueSerializer);
  }

  /**
   * Map compression type string to KafkaJS CompressionTypes
   */
  private getCompressionType(compressionType: string): CompressionTypes {
    switch (compressionType.toLowerCase()) {
      case 'gzip':
        return CompressionTypes.GZIP;
      case 'snappy':
        return CompressionTypes.Snappy;
      case 'lz4':
        return CompressionTypes.LZ4;
      case 'zstd':
        return CompressionTypes.ZSTD;
      default:
        return CompressionTypes.None;
    }
  }

  /**
   * Get Kafka configuration data
   */
  getKafkaConfigData(): KafkaConfigData {
    return this.kafkaConfigData;
  }

  /**
   * Get Kafka producer configuration data
   */
  getKafkaProducerConfigData(): KafkaProducerConfigData {
    return this.kafkaProducerConfigData;
  }
}
