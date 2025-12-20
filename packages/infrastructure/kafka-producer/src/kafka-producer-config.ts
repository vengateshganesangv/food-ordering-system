import { KafkaProducerImpl } from './service/kafka-producer.impl';
import { KafkaConfigData, KafkaProducerConfigData } from '@food-ordering-system/kafka-config-data';

/**
 * Factory class for creating Kafka Producer instances
 * Corresponds to Java's KafkaProducerConfig
 */
export class KafkaProducerConfig {
  /**
   * Create a Kafka Producer instance
   * @param kafkaConfig - Main Kafka configuration
   * @param producerConfig - Producer-specific configuration
   * @returns Configured KafkaProducerImpl instance
   */
  static createProducer<K, V>(
    kafkaConfig: KafkaConfigData,
    producerConfig: KafkaProducerConfigData
  ): KafkaProducerImpl<K, V> {
    return new KafkaProducerImpl<K, V>(kafkaConfig, producerConfig);
  }

  /**
   * Create producer configuration object for KafkaJS
   * @param kafkaConfig - Main Kafka configuration
   * @param producerConfig - Producer-specific configuration
   * @returns Configuration object
   */
  static getProducerConfig(
    kafkaConfig: KafkaConfigData,
    producerConfig: KafkaProducerConfigData
  ): Record<string, any> {
    return {
      brokers: kafkaConfig.bootstrapServers.split(','),
      schemaRegistryUrl: kafkaConfig.schemaRegistryUrl,
      compression: producerConfig.compressionType,
      acks: producerConfig.acks,
      batchSize: producerConfig.batchSize * producerConfig.batchSizeBoostFactor,
      lingerMs: producerConfig.lingerMs,
      requestTimeout: producerConfig.requestTimeoutMs,
      retries: producerConfig.retryCount,
    };
  }
}
