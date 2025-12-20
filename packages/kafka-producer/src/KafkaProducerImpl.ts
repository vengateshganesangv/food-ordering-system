import { Kafka, Producer, ProducerRecord } from 'kafkajs';
import { KafkaProducer } from './KafkaProducer';
import { KafkaProducerException } from './KafkaProducerException';

export class KafkaProducerImpl<K, V> implements KafkaProducer<K, V> {
  private producer: Producer;

  constructor(private kafka: Kafka) {
    this.producer = kafka.producer();
  }

  async connect(): Promise<void> {
    await this.producer.connect();
  }

  async send(
    topicName: string,
    key: K,
    message: V,
    callback?: (error: Error | null, messageId?: string) => void,
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

      const metadata = await this.producer.send(record);
      const messageId = `${metadata[0].topicName}-${metadata[0].partition}-${metadata[0].baseOffset}`;

      if (callback) {
        callback(null, messageId);
      }
    } catch (error) {
      const kafkaError = new KafkaProducerException(
        `Error sending message to topic ${topicName}: ${error}`,
      );
      if (callback) {
        callback(kafkaError);
      }
      throw kafkaError;
    }
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
  }
}
