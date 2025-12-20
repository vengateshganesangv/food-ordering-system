import {
  Kafka,
  Consumer,
  EachBatchPayload,
  EachMessagePayload,
  ConsumerConfig as KafkaJSConsumerConfig,
} from 'kafkajs';
import { KafkaConfigData, KafkaConsumerConfigData } from '@food-ordering-system/kafka-config-data';
import { ConsumerConfig, MessageHandler } from './kafka-consumer.interface';

/**
 * Kafka Consumer implementation using KafkaJS
 * Supports both single message and batch processing
 */
export class KafkaConsumerImpl {
  private consumer: Consumer;
  private readonly consumerConfig: KafkaConsumerConfigData;
  private isConnected: boolean = false;

  constructor(
    private readonly kafkaConfig: KafkaConfigData,
    consumerConfigData: KafkaConsumerConfigData,
    private readonly config: ConsumerConfig
  ) {
    this.consumerConfig = consumerConfigData;

    const kafka = new Kafka({
      clientId: `food-ordering-system-consumer-${config.groupId}`,
      brokers: kafkaConfig.bootstrapServers.split(','),
    });

    const consumerOptions: KafkaJSConsumerConfig = {
      groupId: config.groupId,
      sessionTimeout: consumerConfigData.sessionTimeoutMs,
      heartbeatInterval: consumerConfigData.heartbeatIntervalMs,
      maxBytesPerPartition:
        consumerConfigData.maxPartitionFetchBytesDefault *
        consumerConfigData.maxPartitionFetchBytesBoostFactor,
      retry: {
        retries: 3,
      },
    };

    this.consumer = kafka.consumer(consumerOptions);
  }

  /**
   * Connect the consumer and subscribe to topics
   */
  async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({
        topics: this.config.topics,
        fromBeginning: this.config.fromBeginning || false,
      });
      this.isConnected = true;
      console.log(
        `Kafka consumer connected and subscribed to topics: ${this.config.topics.join(', ')}`
      );
    } catch (error) {
      console.error('Error connecting Kafka consumer:', error);
      throw new Error(`Failed to connect Kafka consumer: ${error}`);
    }
  }

  /**
   * Start consuming messages with a message handler
   * Supports both batch and single message processing
   */
  async run<T>(messageHandler: MessageHandler<T>): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    if (this.consumerConfig.batchListener) {
      // Batch processing mode
      await this.consumer.run({
        autoCommit: true,
        autoCommitInterval: 5000,
        eachBatch: async (payload: EachBatchPayload) => {
          await messageHandler.handleBatch(payload);
        },
      });
    } else {
      // Single message processing mode
      await this.consumer.run({
        autoCommit: true,
        autoCommitInterval: 5000,
        eachMessage: async (payload: EachMessagePayload) => {
          await messageHandler.handleMessage(payload);
        },
      });
    }

    console.log('Kafka consumer is now running');
  }

  /**
   * Pause consumption from specified topics
   */
  async pause(topics?: string[]): Promise<void> {
    const topicsToPause = topics || this.config.topics;
    this.consumer.pause(
      topicsToPause.map((topic) => ({ topic }))
    );
    console.log(`Consumer paused for topics: ${topicsToPause.join(', ')}`);
  }

  /**
   * Resume consumption from specified topics
   */
  async resume(topics?: string[]): Promise<void> {
    const topicsToResume = topics || this.config.topics;
    this.consumer.resume(
      topicsToResume.map((topic) => ({ topic }))
    );
    console.log(`Consumer resumed for topics: ${topicsToResume.join(', ')}`);
  }

  /**
   * Disconnect the consumer
   */
  async disconnect(): Promise<void> {
    if (this.consumer && this.isConnected) {
      console.log('Closing kafka consumer!');
      await this.consumer.disconnect();
      this.isConnected = false;
    }
  }

  /**
   * Get consumer instance
   */
  getConsumer(): Consumer {
    return this.consumer;
  }
}
