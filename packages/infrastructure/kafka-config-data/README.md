# @food-ordering-system/kafka-config-data

TypeScript configuration interfaces for Kafka infrastructure in the food ordering system.

## Overview

This package provides TypeScript interfaces that define the configuration structure for Kafka producers and consumers. It's a direct TypeScript conversion of the Java configuration classes.

## Installation

```bash
npm install @food-ordering-system/kafka-config-data
```

## Interfaces

### KafkaConfigData

Main Kafka configuration interface containing broker and schema registry settings.

```typescript
interface KafkaConfigData {
  bootstrapServers: string;
  schemaRegistryUrlKey: string;
  schemaRegistryUrl: string;
  numOfPartitions: number;
  replicationFactor: number;
}
```

### KafkaProducerConfigData

Producer-specific configuration for message production settings.

```typescript
interface KafkaProducerConfigData {
  keySerializerClass: string;
  valueSerializerClass: string;
  compressionType: 'gzip' | 'snappy' | 'lz4' | 'zstd' | 'none';
  acks: -1 | 0 | 1 | 'all';
  batchSize: number;
  batchSizeBoostFactor: number;
  lingerMs: number;
  requestTimeoutMs: number;
  retryCount: number;
}
```

### KafkaConsumerConfigData

Consumer-specific configuration for message consumption settings.

```typescript
interface KafkaConsumerConfigData {
  keyDeserializer: string;
  valueDeserializer: string;
  autoOffsetReset: 'earliest' | 'latest' | 'none';
  specificAvroReaderKey: string;
  specificAvroReader: string;
  batchListener: boolean;
  autoStartup: boolean;
  concurrencyLevel: number;
  sessionTimeoutMs: number;
  heartbeatIntervalMs: number;
  maxPollIntervalMs: number;
  pollTimeoutMs: number;
  maxPollRecords: number;
  maxPartitionFetchBytesDefault: number;
  maxPartitionFetchBytesBoostFactor: number;
}
```

## Usage

```typescript
import {
  KafkaConfigData,
  KafkaProducerConfigData,
  KafkaConsumerConfigData
} from '@food-ordering-system/kafka-config-data';

const kafkaConfig: KafkaConfigData = {
  bootstrapServers: 'localhost:9092',
  schemaRegistryUrlKey: 'schema.registry.url',
  schemaRegistryUrl: 'http://localhost:8081',
  numOfPartitions: 3,
  replicationFactor: 1
};
```

## Architecture Mapping

This package maintains the same architecture as the Java implementation:
- **Java**: `kafka-config-data` module with `@Configuration` and `@ConfigurationProperties` annotations
- **TypeScript**: Plain interfaces that can be loaded from configuration files or environment variables
