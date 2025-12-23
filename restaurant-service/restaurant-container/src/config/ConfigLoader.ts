import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  schema: string;
}

export interface ServerConfig {
  port: number;
}

export interface RestaurantServiceConfig {
  restaurantApprovalRequestTopicName: string;
  restaurantApprovalResponseTopicName: string;
  outboxSchedulerFixedRate: number;
  outboxSchedulerInitialDelay: number;
}

export interface KafkaConfig {
  bootstrapServers: string[];
  schemaRegistryUrl: string;
  numOfPartitions: number;
  replicationFactor: number;
}

export interface KafkaProducerConfig {
  keySerializer: string;
  valueSerializer: string;
  compressionType: string;
  acks: string;
  batchSize: number;
  batchSizeBoostFactor: number;
  lingerMs: number;
  requestTimeoutMs: number;
  retryCount: number;
}

export interface KafkaConsumerConfig {
  keyDeserializer: string;
  valueDeserializer: string;
  restaurantApprovalConsumerGroupId: string;
  autoOffsetReset: string;
  specificAvroReader: boolean;
  batchListener: boolean;
  autoStartup: boolean;
  concurrencyLevel: number;
  sessionTimeoutMs: number;
  heartbeatIntervalMs: number;
  maxPollIntervalMs: number;
  maxPollRecords: number;
  maxPartitionFetchBytesDefault: number;
  maxPartitionFetchBytesBoostFactor: number;
  pollTimeoutMs: number;
}

export interface LoggingConfig {
  level: {
    root: string;
  };
}

export interface AppConfig {
  server: ServerConfig;
  database: DatabaseConfig;
  restaurantService: RestaurantServiceConfig;
  kafkaConfig: KafkaConfig;
  kafkaProducerConfig: KafkaProducerConfig;
  kafkaConsumerConfig: KafkaConsumerConfig;
  logging: LoggingConfig;
}

export class ConfigLoader {
  private static config: AppConfig;

  public static loadConfig(configPath?: string): AppConfig {
    if (this.config) {
      return this.config;
    }

    const defaultPath = path.join(__dirname, '../../application.yml');
    const filePath = configPath || defaultPath;

    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const rawConfig = yaml.parse(fileContents);

      // Parse database URL
      const dbUrl = rawConfig.spring.datasource.url;
      const dbUrlMatch = dbUrl.match(/jdbc:postgresql:\/\/([^:]+):(\d+)\/([^?]+)\?currentSchema=([^&]+)/);

      if (!dbUrlMatch) {
        throw new Error('Invalid database URL format');
      }

      const [, host, portStr, database, schema] = dbUrlMatch;

      this.config = {
        server: {
          port: rawConfig.server.port,
        },
        database: {
          host,
          port: parseInt(portStr, 10),
          username: rawConfig.spring.datasource.username,
          password: rawConfig.spring.datasource.password,
          database,
          schema,
        },
        restaurantService: {
          restaurantApprovalRequestTopicName: rawConfig['restaurant-service']['restaurant-approval-request-topic-name'],
          restaurantApprovalResponseTopicName: rawConfig['restaurant-service']['restaurant-approval-response-topic-name'],
          outboxSchedulerFixedRate: rawConfig['restaurant-service']['outbox-scheduler-fixed-rate'],
          outboxSchedulerInitialDelay: rawConfig['restaurant-service']['outbox-scheduler-initial-delay'],
        },
        kafkaConfig: {
          bootstrapServers: rawConfig['kafka-config']['bootstrap-servers'].split(',').map((s: string) => s.trim()),
          schemaRegistryUrl: rawConfig['kafka-config']['schema-registry-url'],
          numOfPartitions: rawConfig['kafka-config']['num-of-partitions'],
          replicationFactor: rawConfig['kafka-config']['replication-factor'],
        },
        kafkaProducerConfig: {
          keySerializer: rawConfig['kafka-producer-config']['key-serializer-class'],
          valueSerializer: rawConfig['kafka-producer-config']['value-serializer-class'],
          compressionType: rawConfig['kafka-producer-config']['compression-type'],
          acks: rawConfig['kafka-producer-config']['acks'],
          batchSize: rawConfig['kafka-producer-config']['batch-size'],
          batchSizeBoostFactor: rawConfig['kafka-producer-config']['batch-size-boost-factor'],
          lingerMs: rawConfig['kafka-producer-config']['linger-ms'],
          requestTimeoutMs: rawConfig['kafka-producer-config']['request-timeout-ms'],
          retryCount: rawConfig['kafka-producer-config']['retry-count'],
        },
        kafkaConsumerConfig: {
          keyDeserializer: rawConfig['kafka-consumer-config']['key-deserializer'],
          valueDeserializer: rawConfig['kafka-consumer-config']['value-deserializer'],
          restaurantApprovalConsumerGroupId: rawConfig['kafka-consumer-config']['restaurant-approval-consumer-group-id'],
          autoOffsetReset: rawConfig['kafka-consumer-config']['auto-offset-reset'],
          specificAvroReader: rawConfig['kafka-consumer-config']['specific-avro-reader'],
          batchListener: rawConfig['kafka-consumer-config']['batch-listener'],
          autoStartup: rawConfig['kafka-consumer-config']['auto-startup'],
          concurrencyLevel: rawConfig['kafka-consumer-config']['concurrency-level'],
          sessionTimeoutMs: rawConfig['kafka-consumer-config']['session-timeout-ms'],
          heartbeatIntervalMs: rawConfig['kafka-consumer-config']['heartbeat-interval-ms'],
          maxPollIntervalMs: rawConfig['kafka-consumer-config']['max-poll-interval-ms'],
          maxPollRecords: rawConfig['kafka-consumer-config']['max-poll-records'],
          maxPartitionFetchBytesDefault: rawConfig['kafka-consumer-config']['max-partition-fetch-bytes-default'],
          maxPartitionFetchBytesBoostFactor: rawConfig['kafka-consumer-config']['max-partition-fetch-bytes-boost-factor'],
          pollTimeoutMs: rawConfig['kafka-consumer-config']['poll-timeout-ms'],
        },
        logging: {
          level: {
            root: rawConfig.logging.level['com.food.ordering.system'],
          },
        },
      };

      return this.config;
    } catch (error) {
      throw new Error(`Failed to load configuration: ${error}`);
    }
  }

  public static getConfig(): AppConfig {
    if (!this.config) {
      return this.loadConfig();
    }
    return this.config;
  }
}
