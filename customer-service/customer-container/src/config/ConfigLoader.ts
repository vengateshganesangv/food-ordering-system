import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

/**
 * Application Configuration interface
 */
export interface AppConfig {
  server: {
    port: number;
  };
  customerService: {
    customerTopicName: string;
  };
  datasource: {
    url: string;
    username: string;
    password: string;
  };
  kafkaConfig: {
    bootstrapServers: string;
    schemaRegistryUrl: string;
    numOfPartitions: number;
    replicationFactor: number;
  };
  kafkaProducerConfig: {
    keySerializerClass: string;
    valueSerializerClass: string;
    compressionType: string;
    acks: string;
    batchSize: number;
    lingerMs: number;
    requestTimeoutMs: number;
    retryCount: number;
  };
}

/**
 * Configuration Loader
 * Loads and parses application.yml configuration file
 */
export class ConfigLoader {
  private static config: AppConfig | null = null;

  /**
   * Loads configuration from application.yml
   * @param configPath - Path to the configuration file
   * @returns AppConfig object
   */
  static loadConfig(configPath?: string): AppConfig {
    if (this.config) {
      return this.config;
    }

    const filePath =
      configPath ||
      path.join(__dirname, '../../src/main/resources/application.yml');

    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const rawConfig: any = yaml.load(fileContents);

      this.config = {
        server: {
          port: rawConfig.server?.port || 8184,
        },
        customerService: {
          customerTopicName: rawConfig['customer-service']?.['customer-topic-name'] || 'customer',
        },
        datasource: {
          url: rawConfig.spring?.datasource?.url || 'jdbc:postgresql://localhost:5432/postgres?currentSchema=customer',
          username: rawConfig.spring?.datasource?.username || 'postgres',
          password: rawConfig.spring?.datasource?.password || 'admin',
        },
        kafkaConfig: {
          bootstrapServers: rawConfig['kafka-config']?.['bootstrap-servers'] || 'localhost:19092,localhost:29092,localhost:39092',
          schemaRegistryUrl: rawConfig['kafka-config']?.['schema-registry-url'] || 'http://localhost:8081',
          numOfPartitions: rawConfig['kafka-config']?.['num-of-partitions'] || 3,
          replicationFactor: rawConfig['kafka-config']?.['replication-factor'] || 3,
        },
        kafkaProducerConfig: {
          keySerializerClass: rawConfig['kafka-producer-config']?.['key-serializer-class'] || 'org.apache.kafka.common.serialization.StringSerializer',
          valueSerializerClass: rawConfig['kafka-producer-config']?.['value-serializer-class'] || 'io.confluent.kafka.serializers.KafkaAvroSerializer',
          compressionType: rawConfig['kafka-producer-config']?.['compression-type'] || 'none',
          acks: rawConfig['kafka-producer-config']?.acks || 'all',
          batchSize: rawConfig['kafka-producer-config']?.['batch-size'] || 16384,
          lingerMs: rawConfig['kafka-producer-config']?.['linger-ms'] || 5,
          requestTimeoutMs: rawConfig['kafka-producer-config']?.['request-timeout-ms'] || 60000,
          retryCount: rawConfig['kafka-producer-config']?.['retry-count'] || 5,
        },
      };

      return this.config;
    } catch (error) {
      console.error('Error loading configuration:', error);
      throw new Error(`Failed to load configuration from ${filePath}`);
    }
  }

  /**
   * Resets the cached configuration (useful for testing)
   */
  static reset(): void {
    this.config = null;
  }
}
