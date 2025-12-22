import { Kafka, Consumer, ConsumerConfig, logLevel, EachBatchPayload, EachMessagePayload } from 'kafkajs';
import { KafkaConfigData } from '../../../../kafka-config-data/src/kafka-config-data';
import { KafkaConsumerConfigData } from '../../../../kafka-config-data/src/kafka-consumer-config-data';
import { IKafkaConsumer } from '../kafka-consumer.interface';
import { Logger } from '../../../kafka-producer/src/logger';

/**
 * Kafka consumer configuration and factory
 * Creates and configures Kafka consumer instances
 */
export class KafkaConsumerConfig<K, V> {
  private logger = new Logger('KafkaConsumerConfig');

  constructor(
    private kafkaConfigData: KafkaConfigData,
    private kafkaConsumerConfigData: KafkaConsumerConfigData
  ) {}

  /**
   * Create consumer configuration object for KafkaJS
   */
  getConsumerConfig(groupId: string): ConsumerConfig {
    return {
      groupId: groupId,
      sessionTimeout: this.kafkaConsumerConfigData.getSessionTimeoutMs(),
      heartbeatInterval: this.kafkaConsumerConfigData.getHeartbeatIntervalMs(),
      maxBytesPerPartition:
        this.kafkaConsumerConfigData.getMaxPartitionFetchBytesDefault() *
        this.kafkaConsumerConfigData.getMaxPartitionFetchBytesBoostFactor(),
      retry: {
        retries: 5,
        initialRetryTime: 100
      }
    };
  }

  /**
   * Create Kafka instance
   */
  createKafka(): Kafka {
    const brokers = this.kafkaConfigData.getBootstrapServers().split(',');

    return new Kafka({
      clientId: 'food-ordering-consumer',
      brokers: brokers,
      logLevel: logLevel.INFO,
      retry: {
        retries: 5,
        initialRetryTime: 100
      }
    });
  }

  /**
   * Create consumer instance
   */
  createConsumer(groupId: string): Consumer {
    const kafka = this.createKafka();
    return kafka.consumer(this.getConsumerConfig(groupId));
  }

  /**
   * Subscribe consumer to topics and start consuming
   * @param consumer The KafkaJS consumer instance
   * @param topics Array of topic names to subscribe to
   * @param kafkaConsumer The application's consumer implementation
   * @param valueDeserializer Function to deserialize message values
   */
  async startConsumer<T>(
    consumer: Consumer,
    topics: string[],
    kafkaConsumer: IKafkaConsumer<T>,
    valueDeserializer?: (buffer: Buffer) => T
  ): Promise<void> {
    try {
      await consumer.connect();
      this.logger.info(`Kafka consumer connected successfully`);

      for (const topic of topics) {
        await consumer.subscribe({
          topic,
          fromBeginning: this.kafkaConsumerConfigData.getAutoOffsetReset() === 'earliest'
        });
        this.logger.info(`Subscribed to topic: ${topic}`);
      }

      if (this.kafkaConsumerConfigData.getBatchListener()) {
        // Batch message processing
        await consumer.run({
          autoCommit: true,
          eachBatch: async (payload: EachBatchPayload) => {
            await this.handleBatch(payload, kafkaConsumer, valueDeserializer);
          }
        });
      } else {
        // Single message processing
        await consumer.run({
          autoCommit: true,
          eachMessage: async (payload: EachMessagePayload) => {
            await this.handleMessage(payload, kafkaConsumer, valueDeserializer);
          }
        });
      }

      this.logger.info('Kafka consumer started successfully');
    } catch (error) {
      this.logger.error('Error starting Kafka consumer', error);
      throw error;
    }
  }

  /**
   * Handle batch of messages
   */
  private async handleBatch<T>(
    payload: EachBatchPayload,
    kafkaConsumer: IKafkaConsumer<T>,
    valueDeserializer?: (buffer: Buffer) => T
  ): Promise<void> {
    const { batch, resolveOffset, heartbeat, commitOffsetsIfNecessary } = payload;

    const messages: T[] = [];
    const keys: string[] = [];
    const partitions: number[] = [];
    const offsets: number[] = [];

    for (const message of batch.messages) {
      try {
        const value = message.value
          ? (valueDeserializer
              ? valueDeserializer(message.value)
              : JSON.parse(message.value.toString()) as T)
          : null;

        if (value) {
          messages.push(value);
          keys.push(message.key ? message.key.toString() : '');
          partitions.push(batch.partition);
          offsets.push(Number(message.offset));
        }

        resolveOffset(message.offset);
        await heartbeat();
      } catch (error) {
        this.logger.error(
          `Error processing message at offset ${message.offset} from partition ${batch.partition}`,
          error
        );
      }
    }

    if (messages.length > 0) {
      try {
        await kafkaConsumer.receive(messages, keys, partitions, offsets);
        await commitOffsetsIfNecessary();
      } catch (error) {
        this.logger.error('Error in consumer receive method', error);
        throw error;
      }
    }
  }

  /**
   * Handle single message
   */
  private async handleMessage<T>(
    payload: EachMessagePayload,
    kafkaConsumer: IKafkaConsumer<T>,
    valueDeserializer?: (buffer: Buffer) => T
  ): Promise<void> {
    const { topic, partition, message } = payload;

    try {
      const value = message.value
        ? (valueDeserializer
            ? valueDeserializer(message.value)
            : JSON.parse(message.value.toString()) as T)
        : null;

      if (value) {
        await kafkaConsumer.receive(
          [value],
          [message.key ? message.key.toString() : ''],
          [partition],
          [Number(message.offset)]
        );
      }
    } catch (error) {
      this.logger.error(
        `Error processing message from topic ${topic}, partition ${partition}, offset ${message.offset}`,
        error
      );
      throw error;
    }
  }

  /**
   * Get Kafka configuration data
   */
  getKafkaConfigData(): KafkaConfigData {
    return this.kafkaConfigData;
  }

  /**
   * Get Kafka consumer configuration data
   */
  getKafkaConsumerConfigData(): KafkaConsumerConfigData {
    return this.kafkaConsumerConfigData;
  }

  /**
   * Get poll timeout
   */
  getPollTimeoutMs(): number {
    return this.kafkaConsumerConfigData.getPollTimeoutMs();
  }

  /**
   * Get auto startup flag
   */
  getAutoStartup(): boolean {
    return this.kafkaConsumerConfigData.getAutoStartup();
  }

  /**
   * Get concurrency level
   */
  getConcurrencyLevel(): number {
    return this.kafkaConsumerConfigData.getConcurrencyLevel();
  }
}
