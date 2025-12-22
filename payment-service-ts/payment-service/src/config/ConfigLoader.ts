import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

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

export interface KafkaConsumerConfig {
  paymentConsumerGroupId: string;
  autoOffsetReset: string;
  batchListener: boolean;
  autoStartup: boolean;
  concurrencyLevel: number;
  sessionTimeoutMs: number;
  heartbeatIntervalMs: number;
  maxPollIntervalMs: number;
  maxPollRecords: number;
  pollTimeoutMs: number;
}

export interface PaymentServiceConfig {
  paymentRequestTopicName: string;
  paymentResponseTopicName: string;
  outboxSchedulerFixedRate: number;
  outboxSchedulerInitialDelay: number;
}

export interface AppConfig {
  server: {
    port: number;
  };
  logging: {
    level: {
      root: string;
    };
  };
  paymentService: PaymentServiceConfig;
  database: DatabaseConfig;
  kafkaConfig: KafkaConfig;
  kafkaConsumerConfig: KafkaConsumerConfig;
}

export class ConfigLoader {
  private static config: AppConfig;

  public static loadConfig(configPath?: string): AppConfig {
    if (this.config) {
      return this.config;
    }

    const filePath = configPath || path.join(__dirname, 'application-config.yml');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const rawConfig = yaml.load(fileContents) as any;

    this.config = {
      server: {
        port: rawConfig.server?.port || 8182
      },
      logging: {
        level: {
          root: rawConfig.logging?.level?.root || 'INFO'
        }
      },
      paymentService: {
        paymentRequestTopicName: rawConfig['payment-service']['payment-request-topic-name'],
        paymentResponseTopicName: rawConfig['payment-service']['payment-response-topic-name'],
        outboxSchedulerFixedRate: rawConfig['payment-service']['outbox-scheduler-fixed-rate'],
        outboxSchedulerInitialDelay: rawConfig['payment-service']['outbox-scheduler-initial-delay']
      },
      database: {
        host: rawConfig.database.host,
        port: rawConfig.database.port,
        database: rawConfig.database.database,
        schema: rawConfig.database.schema,
        username: rawConfig.database.username,
        password: rawConfig.database.password
      },
      kafkaConfig: {
        bootstrapServers: rawConfig['kafka-config']['bootstrap-servers'],
        schemaRegistryUrl: rawConfig['kafka-config']['schema-registry-url'],
        numOfPartitions: rawConfig['kafka-config']['num-of-partitions'],
        replicationFactor: rawConfig['kafka-config']['replication-factor']
      },
      kafkaConsumerConfig: {
        paymentConsumerGroupId: rawConfig['kafka-consumer-config']['payment-consumer-group-id'],
        autoOffsetReset: rawConfig['kafka-consumer-config']['auto-offset-reset'],
        batchListener: rawConfig['kafka-consumer-config']['batch-listener'],
        autoStartup: rawConfig['kafka-consumer-config']['auto-startup'],
        concurrencyLevel: rawConfig['kafka-consumer-config']['concurrency-level'],
        sessionTimeoutMs: rawConfig['kafka-consumer-config']['session-timeout-ms'],
        heartbeatIntervalMs: rawConfig['kafka-consumer-config']['heartbeat-interval-ms'],
        maxPollIntervalMs: rawConfig['kafka-consumer-config']['max-poll-interval-ms'],
        maxPollRecords: rawConfig['kafka-consumer-config']['max-poll-records'],
        pollTimeoutMs: rawConfig['kafka-consumer-config']['poll-timeout-ms']
      }
    };

    return this.config;
  }

  public static getConfig(): AppConfig {
    if (!this.config) {
      return this.loadConfig();
    }
    return this.config;
  }
}
