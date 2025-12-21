import { Kafka, Producer, ProducerRecord } from 'kafkajs';
import { KafkaProducer } from './KafkaProducer';

export class KafkaProducerImpl<K, V> implements KafkaProducer<K, V> {
  private producer: Producer;
  private kafka: Kafka;

  constructor(brokers: string[]) {
    this.kafka = new Kafka({
      clientId: 'food-ordering-system',
      brokers: brokers,
      retry: {
        retries: 5,
        initialRetryTime: 300,
        maxRetryTime: 30000,
      },
    });
    this.producer = this.kafka.producer({
      allowAutoTopicCreation: false,
      transactionalId: undefined,
      maxInFlightRequests: 5,
      idempotent: true,
    });
  }

  async connect(): Promise<void> {
    await this.producer.connect();
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
  }

  async send(
    topicName: string,
    key: K,
    message: V,
    callback?: (error: Error | null, result?: any) => void,
  ): Promise<void> {
    try {
      const record: ProducerRecord = {
        topic: topicName,
        messages: [
          {
            key: JSON.stringify(key),
            value: JSON.stringify(message),
          },
        ],
      };

      const result = await this.producer.send(record);

      if (callback) {
        callback(null, result);
      }
    } catch (error) {
      const err = error as Error;
      console.error(`Error sending message to topic ${topicName}:`, err);

      if (callback) {
        callback(err);
      }
      throw err;
    }
  }
}
