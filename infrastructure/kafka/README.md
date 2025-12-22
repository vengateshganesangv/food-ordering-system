# Kafka Infrastructure Modules (TypeScript)

This directory contains the TypeScript implementation of Kafka infrastructure modules converted from Java/Spring Boot.

## Modules

### 1. kafka-config-data
Configuration data classes for Kafka broker, producer, and consumer settings.

**Files:**
- `kafka-config-data.ts` - Main Kafka configuration (bootstrap servers, schema registry, etc.)
- `kafka-consumer-config-data.ts` - Consumer-specific configuration
- `kafka-producer-config-data.ts` - Producer-specific configuration

**Usage:**
```typescript
import { KafkaConfigData, KafkaProducerConfigData, KafkaConsumerConfigData } from '@food-ordering-system/kafka-config-data';

// Create configuration instances (defaults loaded from environment variables)
const kafkaConfig = new KafkaConfigData();
const producerConfig = new KafkaProducerConfigData();
const consumerConfig = new KafkaConsumerConfigData();
```

### 2. kafka-producer
Kafka producer implementation using KafkaJS.

**Files:**
- `kafka-producer-config.ts` - Producer configuration and factory
- `kafka-producer-impl.ts` - KafkaJS producer implementation
- `kafka-producer.interface.ts` - Producer interface
- `kafka-message-helper.ts` - Helper utilities for message handling
- `exception/kafka-producer-exception.ts` - Custom exception class
- `logger.ts` - Simple logging utility

**Usage:**
```typescript
import { KafkaProducerConfig } from '@food-ordering-system/kafka-producer';
import { KafkaConfigData, KafkaProducerConfigData } from '@food-ordering-system/kafka-config-data';

const kafkaConfig = new KafkaConfigData();
const producerConfigData = new KafkaProducerConfigData();
const producerConfig = new KafkaProducerConfig(kafkaConfig, producerConfigData);

// Create producer with optional value serializer
const producer = producerConfig.createProducer<string, MyAvroModel>();

// Send message
await producer.send('my-topic', 'key', message, {
  onSuccess: (metadata) => console.log('Message sent:', metadata),
  onFailure: (error) => console.error('Failed to send:', error)
});

// Disconnect when done
await producer.disconnect();
```

### 3. kafka-consumer
Kafka consumer implementation using KafkaJS.

**Files:**
- `kafka-consumer.interface.ts` - Consumer interface
- `config/kafka-consumer-config.ts` - Consumer configuration and factory

**Usage:**
```typescript
import { IKafkaConsumer, KafkaConsumerConfig } from '@food-ordering-system/kafka-consumer';
import { KafkaConfigData, KafkaConsumerConfigData } from '@food-ordering-system/kafka-config-data';

// Implement the consumer interface
class MyConsumer implements IKafkaConsumer<MyAvroModel> {
  async receive(messages: MyAvroModel[], keys: string[], partitions: number[], offsets: number[]): Promise<void> {
    // Process messages
    for (let i = 0; i < messages.length; i++) {
      console.log(`Processing message from partition ${partitions[i]}, offset ${offsets[i]}`);
      // Your business logic here
    }
  }
}

// Create and start consumer
const kafkaConfig = new KafkaConfigData();
const consumerConfigData = new KafkaConsumerConfigData();
const consumerConfig = new KafkaConsumerConfig(kafkaConfig, consumerConfigData);

const consumer = consumerConfig.createConsumer('my-consumer-group');
const myConsumer = new MyConsumer();

// Start consuming with optional deserializer
await consumerConfig.startConsumer(
  consumer,
  ['my-topic'],
  myConsumer,
  (buffer) => JSON.parse(buffer.toString()) // Optional deserializer
);
```

### 4. kafka-model
Avro model definitions and schemas.

**Files:**
- Enums:
  - `enums/order-approval-status.ts`
  - `enums/payment-order-status.ts`
  - `enums/payment-status.ts`
  - `enums/restaurant-order-status.ts`
- Models:
  - `models/customer-avro-model.ts`
  - `models/product.ts`
  - `models/payment-request-avro-model.ts`
  - `models/payment-response-avro-model.ts`
  - `models/restaurant-approval-request-avro-model.ts`
  - `models/restaurant-approval-response-avro-model.ts`
- `avro-serializer.ts` - Avro serialization/deserialization utilities

**Usage:**
```typescript
import {
  PaymentRequestAvroModel,
  PaymentRequestAvroModelSchema,
  PaymentOrderStatus,
  AvroSerializer
} from '@food-ordering-system/kafka-model';

// Create a message
const message: PaymentRequestAvroModel = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  sagaId: '123e4567-e89b-12d3-a456-426614174001',
  customerId: '123e4567-e89b-12d3-a456-426614174002',
  orderId: '123e4567-e89b-12d3-a456-426614174003',
  price: '99.99',
  createdAt: Date.now(),
  paymentOrderStatus: PaymentOrderStatus.PENDING
};

// Serialize/deserialize with Avro
const serializer = new AvroSerializer(PaymentRequestAvroModelSchema);
const buffer = serializer.serialize(message);
const deserialized = serializer.deserialize(buffer);
```

## Environment Variables

Configure the following environment variables:

### Kafka Configuration
- `KAFKA_BOOTSTRAP_SERVERS` - Kafka broker addresses (default: localhost:9092)
- `KAFKA_SCHEMA_REGISTRY_URL_KEY` - Schema registry URL key (default: schema.registry.url)
- `KAFKA_SCHEMA_REGISTRY_URL` - Schema registry URL (default: http://localhost:8081)
- `KAFKA_NUM_OF_PARTITIONS` - Number of partitions (default: 3)
- `KAFKA_REPLICATION_FACTOR` - Replication factor (default: 3)

### Producer Configuration
- `KAFKA_PRODUCER_KEY_SERIALIZER` - Key serializer class
- `KAFKA_PRODUCER_VALUE_SERIALIZER` - Value serializer class
- `KAFKA_PRODUCER_COMPRESSION_TYPE` - Compression type (default: snappy)
- `KAFKA_PRODUCER_ACKS` - Acknowledgment level (default: all)
- `KAFKA_PRODUCER_BATCH_SIZE` - Batch size in bytes (default: 16384)
- `KAFKA_PRODUCER_BATCH_SIZE_BOOST_FACTOR` - Batch size multiplier (default: 100)
- `KAFKA_PRODUCER_LINGER_MS` - Linger time in ms (default: 5)
- `KAFKA_PRODUCER_REQUEST_TIMEOUT_MS` - Request timeout (default: 60000)
- `KAFKA_PRODUCER_RETRY_COUNT` - Number of retries (default: 5)

### Consumer Configuration
- `KAFKA_CONSUMER_AUTO_OFFSET_RESET` - Offset reset strategy (default: earliest)
- `KAFKA_CONSUMER_BATCH_LISTENER` - Enable batch processing (default: true)
- `KAFKA_CONSUMER_AUTO_STARTUP` - Auto start consumer (default: true)
- `KAFKA_CONSUMER_CONCURRENCY_LEVEL` - Concurrency level (default: 3)
- `KAFKA_CONSUMER_SESSION_TIMEOUT_MS` - Session timeout (default: 10000)
- `KAFKA_CONSUMER_HEARTBEAT_INTERVAL_MS` - Heartbeat interval (default: 3000)
- `KAFKA_CONSUMER_MAX_POLL_INTERVAL_MS` - Max poll interval (default: 300000)
- `KAFKA_CONSUMER_POLL_TIMEOUT_MS` - Poll timeout (default: 150)
- `KAFKA_CONSUMER_MAX_POLL_RECORDS` - Max records per poll (default: 500)
- `KAFKA_CONSUMER_MAX_PARTITION_FETCH_BYTES_DEFAULT` - Max partition fetch bytes (default: 1048576)
- `KAFKA_CONSUMER_MAX_PARTITION_FETCH_BYTES_BOOST_FACTOR` - Boost factor (default: 1)

## Installation

From each module directory:
```bash
npm install
npm run build
```

## Dependencies

- **kafkajs**: Kafka client for Node.js
- **avsc**: Avro serialization library
- **typescript**: TypeScript compiler

## Migration from Java/Spring Boot

This TypeScript implementation preserves the architecture and configuration patterns from the original Java/Spring Boot implementation:

1. **Configuration classes** maintain the same property structure
2. **Producer/Consumer interfaces** provide the same contract
3. **Avro schemas** are identical to Java schemas
4. **Error handling** follows similar patterns
5. **Logging** structure is maintained

## Notes

- The Logger class is a simple console-based implementation. In production, replace it with a proper logging library like winston or pino.
- For schema registry integration, consider using `@kafkajs/confluent-schema-registry` package.
- All Avro schemas include the Java namespace for compatibility with existing Java services.
