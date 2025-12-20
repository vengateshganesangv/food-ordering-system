# @food-ordering-system/kafka-consumer

Kafka consumer implementation for the food ordering system using KafkaJS.

## Overview

This package provides a TypeScript implementation of the Kafka consumer infrastructure, converted from the original Java Spring Kafka implementation to use KafkaJS. It supports both batch and single message processing, maintaining the same architecture as the Java version.

## Installation

```bash
npm install @food-ordering-system/kafka-consumer
```

## Features

- **Batch Processing**: Support for processing messages in batches
- **Single Message Processing**: Traditional one-at-a-time message handling
- **Flexible Configuration**: All KafkaJS consumer configurations supported
- **Auto-commit**: Automatic offset management
- **Pause/Resume**: Control consumption flow
- **Error Handling**: Comprehensive error handling with retry support
- **Abstract Message Listener**: Base class for easy consumer implementation

## Components

### IKafkaConsumer Interface

```typescript
interface IKafkaConsumer<T> {
  receive(
    messages: T[],
    keys: string[],
    partitions: number[],
    offsets: string[]
  ): Promise<void>;
}
```

### KafkaConsumerImpl

Main consumer implementation using KafkaJS.

```typescript
import { KafkaConsumerImpl } from '@food-ordering-system/kafka-consumer';
import { KafkaConfigData, KafkaConsumerConfigData } from '@food-ordering-system/kafka-config-data';

// Create configuration
const kafkaConfig: KafkaConfigData = {
  bootstrapServers: 'localhost:9092',
  // ... other config
};

const consumerConfigData: KafkaConsumerConfigData = {
  batchListener: true,
  concurrencyLevel: 3,
  // ... other config
};

const consumerConfig = {
  groupId: 'payment-service-group',
  topics: ['payment-request-topic'],
  fromBeginning: false
};

// Create consumer
const consumer = new KafkaConsumerImpl(
  kafkaConfig,
  consumerConfigData,
  consumerConfig
);

// Connect and subscribe
await consumer.connect();

// Run with message handler
await consumer.run(messageHandler);
```

### KafkaBatchMessageListener

Abstract base class for implementing batch message processing.

```typescript
import { KafkaBatchMessageListener } from '@food-ordering-system/kafka-consumer';
import { IKafkaConsumer } from '@food-ordering-system/kafka-consumer';

class PaymentRequestListener extends KafkaBatchMessageListener<PaymentRequest> {
  constructor(private paymentConsumer: IKafkaConsumer<PaymentRequest>) {
    super(paymentConsumer);
  }

  protected deserializeMessage(value: string): PaymentRequest {
    return JSON.parse(value) as PaymentRequest;
  }
}

// Usage
class PaymentConsumer implements IKafkaConsumer<PaymentRequest> {
  async receive(
    messages: PaymentRequest[],
    keys: string[],
    partitions: number[],
    offsets: string[]
  ): Promise<void> {
    for (let i = 0; i < messages.length; i++) {
      console.log(`Processing message ${i}:`, messages[i]);
      console.log(`Key: ${keys[i]}, Partition: ${partitions[i]}, Offset: ${offsets[i]}`);
      // Process payment request
      await processPayment(messages[i]);
    }
  }
}

const paymentConsumer = new PaymentConsumer();
const listener = new PaymentRequestListener(paymentConsumer);

await consumer.run(listener);
```

### MessageHandler Interface

```typescript
interface MessageHandler<T> {
  handleMessage(payload: EachMessagePayload): Promise<void>;
  handleBatch(payload: EachBatchPayload): Promise<void>;
}
```

## Usage Examples

### Batch Processing

```typescript
import { KafkaConsumerImpl, KafkaBatchMessageListener, IKafkaConsumer } from '@food-ordering-system/kafka-consumer';

// Implement your consumer
class OrderConsumer implements IKafkaConsumer<Order> {
  async receive(
    messages: Order[],
    keys: string[],
    partitions: number[],
    offsets: string[]
  ): Promise<void> {
    console.log(`Processing ${messages.length} orders`);

    for (let i = 0; i < messages.length; i++) {
      await this.processOrder(messages[i]);
    }
  }

  private async processOrder(order: Order): Promise<void> {
    // Your business logic here
  }
}

// Create listener
class OrderListener extends KafkaBatchMessageListener<Order> {
  protected deserializeMessage(value: string): Order {
    return JSON.parse(value) as Order;
  }
}

// Setup and run
const orderConsumer = new OrderConsumer();
const listener = new OrderListener(orderConsumer);

const consumer = new KafkaConsumerImpl(kafkaConfig, consumerConfigData, {
  groupId: 'order-service',
  topics: ['order-topic']
});

await consumer.connect();
await consumer.run(listener);
```

### Single Message Processing

```typescript
const consumerConfigData: KafkaConsumerConfigData = {
  batchListener: false, // Disable batch mode
  // ... other config
};

const consumer = new KafkaConsumerImpl(kafkaConfig, consumerConfigData, consumerConfig);
await consumer.connect();
await consumer.run(listener); // Will process one message at a time
```

### Pause and Resume

```typescript
// Pause consumption
await consumer.pause(['order-topic']);

// Resume after some condition
await consumer.resume(['order-topic']);
```

## Architecture Mapping

### Java to TypeScript Conversion

| Java Component | TypeScript Component | Notes |
|---------------|---------------------|-------|
| `KafkaConsumer<T>` interface | `IKafkaConsumer<T>` | Same receive method signature |
| `KafkaConsumerConfig` | `KafkaConsumerConfig` | Factory methods instead of Spring beans |
| `@KafkaListener` annotation | `MessageHandler` interface | Manual message handling |
| Spring's listener container | `KafkaConsumerImpl.run()` | Explicit consumer run |
| Batch message listener | `KafkaBatchMessageListener` | Abstract base class |
| Spring's `ConsumerRecords` | Arrays of messages/keys/partitions/offsets | Same data structure |

## Key Differences from Java

1. **No Spring Framework**: Uses plain TypeScript classes
2. **KafkaJS Library**: Uses KafkaJS instead of Spring Kafka
3. **Explicit Connection**: Must call `connect()` before consuming
4. **Manual Listener Setup**: No annotation-based listeners
5. **Async/Await**: Modern promise-based API
6. **JSON Deserialization**: Built-in JSON support (no Avro by default)

## Configuration

The consumer supports all KafkaJS consumer configurations:

- **Session Timeout**: Configured via `sessionTimeoutMs`
- **Heartbeat Interval**: Configured via `heartbeatIntervalMs`
- **Max Poll Interval**: Configured via `maxPollIntervalMs`
- **Batch Size**: Controlled by `maxPartitionFetchBytes` and boost factor
- **Auto Commit**: Enabled by default with 5-second interval
- **Concurrency**: Controlled by KafkaJS consumer groups

## Error Handling

- Errors during message processing are logged and re-thrown
- KafkaJS handles retries based on configuration
- Connection errors throw during `connect()`
- Batch processing continues even if individual message deserialization fails
- Proper cleanup on `disconnect()`
