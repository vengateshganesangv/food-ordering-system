# @food-ordering-system/kafka-producer

Kafka producer implementation for the food ordering system using KafkaJS.

## Overview

This package provides a TypeScript implementation of the Kafka producer infrastructure, converted from the original Java Spring Kafka implementation to use KafkaJS. It maintains the same architecture and patterns including callback-based message handling and outbox pattern support.

## Installation

```bash
npm install @food-ordering-system/kafka-producer
```

## Features

- **Async/Promise-based API**: Modern async/await support
- **Callback Support**: Success/failure callbacks for message delivery
- **Outbox Pattern**: Integration with outbox pattern for reliable message delivery
- **Error Handling**: Custom KafkaProducerException for error scenarios
- **Message Helper**: Utility class for JSON serialization and callback creation
- **Configurable**: Supports all KafkaJS producer configurations

## Components

### IKafkaProducer Interface

```typescript
interface IKafkaProducer<K, V> {
  send(
    topicName: string,
    key: K,
    message: V,
    callback: KafkaProducerCallback<K, V>
  ): Promise<void>;

  close(): Promise<void>;
}
```

### KafkaProducerImpl

Main producer implementation using KafkaJS.

```typescript
import { KafkaProducerImpl, KafkaProducerConfig } from '@food-ordering-system/kafka-producer';
import { KafkaConfigData, KafkaProducerConfigData } from '@food-ordering-system/kafka-config-data';

// Create configuration
const kafkaConfig: KafkaConfigData = {
  bootstrapServers: 'localhost:9092',
  // ... other config
};

const producerConfig: KafkaProducerConfigData = {
  compressionType: 'gzip',
  acks: -1,
  // ... other config
};

// Create producer instance
const producer = new KafkaProducerImpl<string, any>(kafkaConfig, producerConfig);

// Connect
await producer.connect();

// Send message with callback
await producer.send(
  'payment-topic',
  'order-123',
  { orderId: '123', amount: 100 },
  {
    onSuccess: (metadata) => {
      console.log('Message sent successfully', metadata);
    },
    onFailure: (error) => {
      console.error('Failed to send message', error);
    }
  }
);

// Close when done
await producer.close();
```

### KafkaMessageHelper

Utility class for message processing and callback creation with outbox pattern support.

```typescript
import { KafkaMessageHelper } from '@food-ordering-system/kafka-producer';
import { OutboxStatus } from '@food-ordering-system/outbox';

const helper = new KafkaMessageHelper();

// Parse JSON payload
const event = helper.getOrderEventPayload<OrderEvent>(jsonString);

// Create callback with outbox status handling
const callback = helper.getKafkaCallback(
  'payment-response-topic',
  paymentMessage,
  outboxMessage,
  (msg, status) => {
    // Update outbox status
    updateOutboxStatus(msg, status);
  },
  'order-123',
  'PaymentRequestAvroModel'
);
```

### KafkaProducerException

Custom exception for producer errors.

```typescript
throw new KafkaProducerException('Failed to send message');
```

## Architecture Mapping

### Java to TypeScript Conversion

| Java Component | TypeScript Component | Notes |
|---------------|---------------------|-------|
| `KafkaProducer<K, V>` interface | `IKafkaProducer<K, V>` | Same contract |
| `KafkaProducerImpl` | `KafkaProducerImpl` | Uses KafkaJS instead of Spring Kafka |
| `KafkaProducerConfig` | `KafkaProducerConfig` | Factory methods instead of Spring beans |
| `KafkaMessageHelper` | `KafkaMessageHelper` | Same helper methods |
| `KafkaProducerException` | `KafkaProducerException` | Custom error class |
| Spring's `ListenableFutureCallback` | `KafkaProducerCallback` | Similar callback interface |
| Spring's `KafkaTemplate` | KafkaJS `Producer` | Direct KafkaJS usage |

## Key Differences from Java

1. **No Spring Framework**: Uses plain TypeScript classes instead of Spring beans
2. **KafkaJS Library**: Uses KafkaJS instead of Spring Kafka
3. **Async/Await**: Uses promises and async/await instead of Spring's ListenableFuture
4. **Manual Connection**: Requires explicit connect() call before sending messages
5. **JSON Serialization**: Built-in JSON serialization (KafkaJS doesn't use Avro by default)

## Error Handling

The producer includes comprehensive error handling:
- Connection errors throw during `connect()`
- Send errors are passed to the failure callback
- Automatic retries based on configuration
- Proper cleanup on `close()`
