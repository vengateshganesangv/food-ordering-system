import { KafkaConsumerImpl } from '../kafka-consumer.impl';
import { KafkaConfigData, KafkaConsumerConfigData } from '@food-ordering-system/kafka-config-data';
import { ConsumerConfig } from '../kafka-consumer.interface';

/**
 * Factory class for creating Kafka Consumer instances
 * Corresponds to Java's KafkaConsumerConfig
 */
export class KafkaConsumerConfig {
  /**
   * Create a Kafka Consumer instance
   * @param kafkaConfig - Main Kafka configuration
   * @param consumerConfigData - Consumer-specific configuration
   * @param consumerConfig - Consumer runtime configuration (groupId, topics, etc.)
   * @returns Configured KafkaConsumerImpl instance
   */
  static createConsumer(
    kafkaConfig: KafkaConfigData,
    consumerConfigData: KafkaConsumerConfigData,
    consumerConfig: ConsumerConfig
  ): KafkaConsumerImpl {
    return new KafkaConsumerImpl(kafkaConfig, consumerConfigData, consumerConfig);
  }

  /**
   * Create consumer configuration object for KafkaJS
   * @param kafkaConfig - Main Kafka configuration
   * @param consumerConfigData - Consumer-specific configuration
   * @param groupId - Consumer group ID
   * @returns Configuration object
   */
  static getConsumerConfig(
    kafkaConfig: KafkaConfigData,
    consumerConfigData: KafkaConsumerConfigData,
    groupId: string
  ): Record<string, any> {
    return {
      brokers: kafkaConfig.bootstrapServers.split(','),
      groupId,
      sessionTimeout: consumerConfigData.sessionTimeoutMs,
      heartbeatInterval: consumerConfigData.heartbeatIntervalMs,
      maxPollInterval: consumerConfigData.maxPollIntervalMs,
      maxBytesPerPartition:
        consumerConfigData.maxPartitionFetchBytesDefault *
        consumerConfigData.maxPartitionFetchBytesBoostFactor,
      maxWaitTimeInMs: consumerConfigData.pollTimeoutMs,
      retry: {
        retries: 3,
      },
      autoCommit: true,
      autoCommitInterval: 5000,
    };
  }
}
