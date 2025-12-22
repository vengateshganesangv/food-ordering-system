# Kafka Infrastructure Migration Guide: Java to TypeScript

## Overview

This document describes the migration of Kafka infrastructure modules from Java/Spring Boot to TypeScript/Node.js using KafkaJS and avsc libraries.

## Conversion Summary

### 1. kafka-config-data Module

**Original (Java):**
- Location: `/infrastructure/kafka/kafka-config-data/src/main/java/com/food/ordering/system/kafka/config/data/`
- Framework: Spring Boot with `@Configuration` and `@ConfigurationProperties` annotations
- Files: 3 Java configuration classes

**Converted (TypeScript):**
- Location: `/infrastructure/kafka/kafka-config-data/src/`
- Pattern: TypeScript classes with environment variable defaults
- Files: 3 TypeScript configuration classes + index.ts

| Java File | TypeScript File | Notes |
|-----------|----------------|-------|
| KafkaConfigData.java | kafka-config-data.ts | Main Kafka configuration |
| KafkaConsumerConfigData.java | kafka-consumer-config-data.ts | Consumer configuration |
| KafkaProducerConfigData.java | kafka-producer-config-data.ts | Producer configuration |

**Key Changes:**
- Spring's `@ConfigurationProperties` → Constructor with environment variable defaults
- Lombok's `@Data` → Manual getters/setters
- All configuration properties preserved with same names

### 2. kafka-producer Module

**Original (Java):**
- Location: `/infrastructure/kafka/kafka-producer/src/main/java/com/food/ordering/system/kafka/producer/`
- Framework: Spring Kafka with `KafkaTemplate`
- Files: 5 Java files

**Converted (TypeScript):**
- Location: `/infrastructure/kafka/kafka-producer/src/`
- Library: KafkaJS
- Files: 7 TypeScript files (+ index.ts)

| Java File | TypeScript File | Notes |
|-----------|----------------|-------|
| KafkaProducerConfig.java | kafka-producer-config.ts | Producer configuration factory |
| KafkaProducerException.java | exception/kafka-producer-exception.ts | Custom exception class |
| KafkaMessageHelper.java | kafka-message-helper.ts | Message handling utilities |
| service/KafkaProducer.java | service/kafka-producer.interface.ts | Producer interface |
| service/impl/KafkaProducerImpl.java | service/kafka-producer-impl.ts | Producer implementation |
| N/A | logger.ts | New: Logging utility |

**Key Changes:**
- Spring's `KafkaTemplate` → KafkaJS `Producer`
- `ListenableFutureCallback` → Custom callback interface with `onSuccess`/`onFailure`
- Spring's `@PreDestroy` → Manual `disconnect()` method
- Added lazy connection initialization
- Preserved all configuration properties (compression, acks, retries, etc.)

### 3. kafka-consumer Module

**Original (Java):**
- Location: `/infrastructure/kafka/kafka-consumer/src/main/java/com/food/ordering/system/kafka/consumer/`
- Framework: Spring Kafka with `@KafkaListener`
- Files: 2 Java files

**Converted (TypeScript):**
- Location: `/infrastructure/kafka/kafka-consumer/src/`
- Library: KafkaJS
- Files: 2 TypeScript files + index.ts

| Java File | TypeScript File | Notes |
|-----------|----------------|-------|
| KafkaConsumer.java | kafka-consumer.interface.ts | Consumer interface |
| config/KafkaConsumerConfig.java | config/kafka-consumer-config.ts | Consumer configuration |

**Key Changes:**
- Spring's `@KafkaListener` → KafkaJS `consumer.run()` with `eachBatch`/`eachMessage`
- `ConcurrentKafkaListenerContainerFactory` → KafkaJS consumer factory
- Batch and single message processing modes preserved
- Auto-offset commit configuration maintained
- Added manual heartbeat handling for batch processing

### 4. kafka-model Module

**Original (Java):**
- Location: `/infrastructure/kafka/kafka-model/src/main/java/com/food/ordering/system/kafka/order/avro/model/`
- Framework: Apache Avro auto-generated Java classes
- Files: 11 Java files (4 enums + 7 models)

**Converted (TypeScript):**
- Location: `/infrastructure/kafka/kafka-model/src/`
- Library: avsc for Avro serialization
- Files: 11 TypeScript files + avro-serializer.ts + index.ts

| Java File | TypeScript File | Notes |
|-----------|----------------|-------|
| OrderApprovalStatus.java | enums/order-approval-status.ts | Enum + Avro schema |
| PaymentOrderStatus.java | enums/payment-order-status.ts | Enum + Avro schema |
| PaymentStatus.java | enums/payment-status.ts | Enum + Avro schema |
| RestaurantOrderStatus.java | enums/restaurant-order-status.ts | Enum + Avro schema |
| CustomerAvroModel.java | models/customer-avro-model.ts | Interface + Avro schema |
| Product.java | models/product.ts | Interface + Avro schema |
| PaymentRequestAvroModel.java | models/payment-request-avro-model.ts | Interface + Avro schema |
| PaymentResponseAvroModel.java | models/payment-response-avro-model.ts | Interface + Avro schema |
| RestaurantApprovalRequestAvroModel.java | models/restaurant-approval-request-avro-model.ts | Interface + Avro schema |
| RestaurantApprovalResponseAvroModel.java | models/restaurant-approval-response-avro-model.ts | Interface + Avro schema |
| N/A | avro-serializer.ts | New: Avro helper utilities |

**Key Changes:**
- Avro-generated Java classes → TypeScript interfaces + JSON schemas
- Removed Avro builder pattern (not needed in TypeScript)
- Avro schemas defined as JSON objects compatible with avsc
- BigDecimal → string (requires conversion in application code)
- Instant → number (timestamp-millis as long)
- Added AvroSerializer helper class for serialization/deserialization

## Technical Mapping

### Dependency Injection
- **Java**: Spring's `@Configuration` and `@Bean`
- **TypeScript**: Direct instantiation via factory methods

### Configuration
- **Java**: `@ConfigurationProperties` with YAML/properties files
- **TypeScript**: Environment variables with default values

### Logging
- **Java**: SLF4J with `@Slf4j`
- **TypeScript**: Simple console-based Logger class (can be replaced with winston/pino)

### Error Handling
- **Java**: Spring's exception hierarchy
- **TypeScript**: Custom Error classes extending Error

### Kafka Client
- **Java**: Spring Kafka (wrapper around Apache Kafka)
- **TypeScript**: KafkaJS (native Node.js Kafka client)

### Avro Serialization
- **Java**: Apache Avro with generated classes
- **TypeScript**: avsc library with JSON schemas

## File Structure Comparison

### Java Structure
```
infrastructure/kafka/
├── kafka-config-data/
│   └── src/main/java/com/food/ordering/system/kafka/config/data/
│       ├── KafkaConfigData.java
│       ├── KafkaConsumerConfigData.java
│       └── KafkaProducerConfigData.java
├── kafka-producer/
│   └── src/main/java/com/food/ordering/system/kafka/producer/
│       ├── KafkaProducerConfig.java
│       ├── KafkaMessageHelper.java
│       ├── exception/KafkaProducerException.java
│       └── service/
│           ├── KafkaProducer.java
│           └── impl/KafkaProducerImpl.java
├── kafka-consumer/
│   └── src/main/java/com/food/ordering/system/kafka/consumer/
│       ├── KafkaConsumer.java
│       └── config/KafkaConsumerConfig.java
└── kafka-model/
    └── src/main/java/com/food/ordering/system/kafka/order/avro/model/
        ├── [11 Avro-generated files]
```

### TypeScript Structure
```
infrastructure/kafka/
├── kafka-config-data/
│   ├── src/
│   │   ├── kafka-config-data.ts
│   │   ├── kafka-consumer-config-data.ts
│   │   ├── kafka-producer-config-data.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── kafka-producer/
│   ├── src/
│   │   ├── kafka-producer-config.ts
│   │   ├── kafka-message-helper.ts
│   │   ├── logger.ts
│   │   ├── exception/
│   │   │   └── kafka-producer-exception.ts
│   │   ├── service/
│   │   │   ├── kafka-producer.interface.ts
│   │   │   └── kafka-producer-impl.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── kafka-consumer/
│   ├── src/
│   │   ├── kafka-consumer.interface.ts
│   │   ├── config/
│   │   │   └── kafka-consumer-config.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
└── kafka-model/
    ├── src/
    │   ├── enums/
    │   │   ├── order-approval-status.ts
    │   │   ├── payment-order-status.ts
    │   │   ├── payment-status.ts
    │   │   └── restaurant-order-status.ts
    │   ├── models/
    │   │   ├── customer-avro-model.ts
    │   │   ├── product.ts
    │   │   ├── payment-request-avro-model.ts
    │   │   ├── payment-response-avro-model.ts
    │   │   ├── restaurant-approval-request-avro-model.ts
    │   │   └── restaurant-approval-response-avro-model.ts
    │   ├── avro-serializer.ts
    │   └── index.ts
    ├── package.json
    └── tsconfig.json
```

## Configuration Properties Preserved

All Spring Boot configuration properties have been preserved and can be set via environment variables:

### Kafka Config
- `kafka-config.bootstrap-servers` → `KAFKA_BOOTSTRAP_SERVERS`
- `kafka-config.schema-registry-url-key` → `KAFKA_SCHEMA_REGISTRY_URL_KEY`
- `kafka-config.schema-registry-url` → `KAFKA_SCHEMA_REGISTRY_URL`
- `kafka-config.num-of-partitions` → `KAFKA_NUM_OF_PARTITIONS`
- `kafka-config.replication-factor` → `KAFKA_REPLICATION_FACTOR`

### Producer Config
- `kafka-producer-config.key-serializer-class` → `KAFKA_PRODUCER_KEY_SERIALIZER`
- `kafka-producer-config.value-serializer-class` → `KAFKA_PRODUCER_VALUE_SERIALIZER`
- `kafka-producer-config.compression-type` → `KAFKA_PRODUCER_COMPRESSION_TYPE`
- `kafka-producer-config.acks` → `KAFKA_PRODUCER_ACKS`
- `kafka-producer-config.batch-size` → `KAFKA_PRODUCER_BATCH_SIZE`
- `kafka-producer-config.batch-size-boost-factor` → `KAFKA_PRODUCER_BATCH_SIZE_BOOST_FACTOR`
- `kafka-producer-config.linger-ms` → `KAFKA_PRODUCER_LINGER_MS`
- `kafka-producer-config.request-timeout-ms` → `KAFKA_PRODUCER_REQUEST_TIMEOUT_MS`
- `kafka-producer-config.retry-count` → `KAFKA_PRODUCER_RETRY_COUNT`

### Consumer Config
- `kafka-consumer-config.auto-offset-reset` → `KAFKA_CONSUMER_AUTO_OFFSET_RESET`
- `kafka-consumer-config.batch-listener` → `KAFKA_CONSUMER_BATCH_LISTENER`
- `kafka-consumer-config.auto-startup` → `KAFKA_CONSUMER_AUTO_STARTUP`
- `kafka-consumer-config.concurrency-level` → `KAFKA_CONSUMER_CONCURRENCY_LEVEL`
- `kafka-consumer-config.session-timeout-ms` → `KAFKA_CONSUMER_SESSION_TIMEOUT_MS`
- `kafka-consumer-config.heartbeat-interval-ms` → `KAFKA_CONSUMER_HEARTBEAT_INTERVAL_MS`
- `kafka-consumer-config.max-poll-interval-ms` → `KAFKA_CONSUMER_MAX_POLL_INTERVAL_MS`
- `kafka-consumer-config.poll-timeout-ms` → `KAFKA_CONSUMER_POLL_TIMEOUT_MS`
- `kafka-consumer-config.max-poll-records` → `KAFKA_CONSUMER_MAX_POLL_RECORDS`
- `kafka-consumer-config.max-partition-fetch-bytes-default` → `KAFKA_CONSUMER_MAX_PARTITION_FETCH_BYTES_DEFAULT`
- `kafka-consumer-config.max-partition-fetch-bytes-boost-factor` → `KAFKA_CONSUMER_MAX_PARTITION_FETCH_BYTES_BOOST_FACTOR`

## Dependencies

### NPM Packages Required

Each module has its own `package.json`:

**kafka-config-data:**
- No external dependencies (only dev dependencies for TypeScript)

**kafka-producer:**
- `kafkajs`: ^2.2.4

**kafka-consumer:**
- `kafkajs`: ^2.2.4

**kafka-model:**
- `avsc`: ^5.7.7

## Installation & Build

```bash
# Install and build all modules
cd infrastructure/kafka/kafka-config-data
npm install && npm run build

cd ../kafka-producer
npm install && npm run build

cd ../kafka-consumer
npm install && npm run build

cd ../kafka-model
npm install && npm run build
```

## Notable Differences & Considerations

1. **Avro Schema Registry**: The Java implementation may use Confluent Schema Registry. For TypeScript, you may need to add `@kafkajs/confluent-schema-registry` if using schema registry.

2. **BigDecimal Handling**: Java's `BigDecimal` is represented as string in TypeScript. Application code must handle conversion.

3. **Timestamp Handling**: Java's `Instant` is represented as number (milliseconds) in TypeScript.

4. **Logging**: The provided Logger is basic. For production, replace with winston, pino, or similar.

5. **Dependency Injection**: Spring's DI is replaced with manual instantiation. Consider using a DI container like tsyringe or inversify if needed.

6. **Generics**: TypeScript generics work differently than Java. The implementation uses proper TypeScript generic constraints.

7. **Async/Await**: KafkaJS is promise-based, so all operations are async/await instead of Java's callback-based approach.

## Testing Recommendations

1. **Unit Tests**: Add Jest or Mocha for unit testing
2. **Integration Tests**: Use testcontainers for Kafka integration tests
3. **Schema Validation**: Test Avro serialization/deserialization with all models
4. **Error Handling**: Test producer/consumer error scenarios

## Next Steps

1. Add proper logging library (winston/pino)
2. Add schema registry integration if needed
3. Add unit and integration tests
4. Add monitoring and metrics (e.g., Prometheus)
5. Add health checks for Kafka connectivity
6. Consider adding retry policies for consumer processing
7. Add dead letter queue handling

## Compatibility

The TypeScript implementation is designed to be compatible with the Java implementation:
- Same Avro schemas (same namespace)
- Same configuration properties (via environment variables)
- Same message formats
- Can produce/consume messages to/from Java services

## File Count Summary

| Module | Java Files | TypeScript Files | Notes |
|--------|-----------|------------------|-------|
| kafka-config-data | 3 | 4 | +1 index.ts |
| kafka-producer | 5 | 7 | +1 logger.ts, +1 index.ts |
| kafka-consumer | 2 | 3 | +1 index.ts |
| kafka-model | 11 | 13 | +1 avro-serializer.ts, +1 index.ts |
| **Total** | **21** | **27** | +6 additional files |

Additional files created:
- 4 x package.json (one per module)
- 4 x tsconfig.json (one per module)
- 1 x README.md (documentation)
- 1 x MIGRATION_GUIDE.md (this file)

**Grand Total: 37 files created**
