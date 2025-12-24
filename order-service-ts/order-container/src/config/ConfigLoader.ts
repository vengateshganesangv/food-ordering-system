import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

export interface ServerConfig {
  port: number;
}

export interface OrderServiceConfig {
  paymentRequestTopicName: string;
  paymentResponseTopicName: string;
  restaurantApprovalRequestTopicName: string;
  restaurantApprovalResponseTopicName: string;
  customerTopicName: string;
  outboxSchedulerFixedRate: number;
  outboxSchedulerInitialDelay: number;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  schema: string;
  username: string;
  password: string;
}

export interface KafkaConfig {
  bootstrapServers: string[];
  schemaRegistryUrl: string;
  numOfPartitions: number;
  replicationFactor: number;
}

export interface KafkaProducerConfig {
  compressionType: string;
  acks: string;
  batchSize: number;
  lingerMs: number;
  requestTimeoutMs: number;
  retryCount: number;
}

export interface KafkaConsumerConfig {
  paymentConsumerGroupId: string;
  restaurantApprovalConsumerGroupId: string;
  customerGroupId: string;
  autoOffsetReset: string;
  autoStartup: boolean;
  concurrencyLevel: number;
  sessionTimeoutMs: number;
  heartbeatIntervalMs: number;
  maxPollIntervalMs: number;
  maxPollRecords: number;
  pollTimeoutMs: number;
}

export interface AppConfig {
  server: ServerConfig;
  orderService: OrderServiceConfig;
  database: DatabaseConfig;
  kafka: KafkaConfig;
  kafkaProducer: KafkaProducerConfig;
  kafkaConsumer: KafkaConsumerConfig;
}

export class ConfigLoader {
  private config: AppConfig;

  constructor(configPath?: string) {
    const configFilePath = configPath || path.join(__dirname, '../../config/application.yml');
    this.config = this.loadConfig(configFilePath);
  }

  private loadConfig(configPath: string): AppConfig {
    try {
      const fileContents = fs.readFileSync(configPath, 'utf8');
      const rawConfig = yaml.load(fileContents) as any;

      return {
        server: {
          port: rawConfig.server?.port || 8181,
        },
        orderService: {
          paymentRequestTopicName: rawConfig['order-service']?.['payment-request-topic-name'] || 'payment-request',
          paymentResponseTopicName:
            rawConfig['order-service']?.['payment-response-topic-name'] || 'payment-response',
          restaurantApprovalRequestTopicName:
            rawConfig['order-service']?.['restaurant-approval-request-topic-name'] ||
            'restaurant-approval-request',
          restaurantApprovalResponseTopicName:
            rawConfig['order-service']?.['restaurant-approval-response-topic-name'] ||
            'restaurant-approval-response',
          customerTopicName: rawConfig['order-service']?.['customer-topic-name'] || 'customer',
          outboxSchedulerFixedRate: rawConfig['order-service']?.['outbox-scheduler-fixed-rate'] || 10000,
          outboxSchedulerInitialDelay: rawConfig['order-service']?.['outbox-scheduler-initial-delay'] || 10000,
        },
        database: {
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432'),
          database: process.env.DB_NAME || 'postgres',
          schema: process.env.DB_SCHEMA || 'order',
          username: process.env.DB_USERNAME || rawConfig.spring?.datasource?.username || 'postgres',
          password: process.env.DB_PASSWORD || rawConfig.spring?.datasource?.password || 'admin',
        },
        kafka: {
          bootstrapServers: rawConfig['kafka-config']?.['bootstrap-servers']?.split(',').map((s: string) => s.trim()) || [
            'localhost:19092',
            'localhost:29092',
            'localhost:39092',
          ],
          schemaRegistryUrl: rawConfig['kafka-config']?.['schema-registry-url'] || 'http://localhost:8081',
          numOfPartitions: rawConfig['kafka-config']?.['num-of-partitions'] || 3,
          replicationFactor: rawConfig['kafka-config']?.['replication-factor'] || 3,
        },
        kafkaProducer: {
          compressionType: rawConfig['kafka-producer-config']?.['compression-type'] || 'none',
          acks: rawConfig['kafka-producer-config']?.acks || 'all',
          batchSize: rawConfig['kafka-producer-config']?.['batch-size'] || 16384,
          lingerMs: rawConfig['kafka-producer-config']?.['linger-ms'] || 5,
          requestTimeoutMs: rawConfig['kafka-producer-config']?.['request-timeout-ms'] || 60000,
          retryCount: rawConfig['kafka-producer-config']?.['retry-count'] || 5,
        },
        kafkaConsumer: {
          paymentConsumerGroupId: rawConfig['kafka-consumer-config']?.['payment-consumer-group-id'] || 'payment-topic-consumer',
          restaurantApprovalConsumerGroupId:
            rawConfig['kafka-consumer-config']?.['restaurant-approval-consumer-group-id'] ||
            'restaurant-approval-topic-consumer',
          customerGroupId: rawConfig['kafka-consumer-config']?.['customer-group-id'] || 'customer-topic-consumer',
          autoOffsetReset: rawConfig['kafka-consumer-config']?.['auto-offset-reset'] || 'earliest',
          autoStartup: rawConfig['kafka-consumer-config']?.['auto-startup'] !== false,
          concurrencyLevel: rawConfig['kafka-consumer-config']?.['concurrency-level'] || 3,
          sessionTimeoutMs: rawConfig['kafka-consumer-config']?.['session-timeout-ms'] || 10000,
          heartbeatIntervalMs: rawConfig['kafka-consumer-config']?.['heartbeat-interval-ms'] || 3000,
          maxPollIntervalMs: rawConfig['kafka-consumer-config']?.['max-poll-interval-ms'] || 300000,
          maxPollRecords: rawConfig['kafka-consumer-config']?.['max-poll-records'] || 500,
          pollTimeoutMs: rawConfig['kafka-consumer-config']?.['poll-timeout-ms'] || 150,
        },
      };
    } catch (e) {
      throw new Error(`Failed to load configuration: ${(e as Error).message}`);
    }
  }

  getConfig(): AppConfig {
    return this.config;
  }
}
