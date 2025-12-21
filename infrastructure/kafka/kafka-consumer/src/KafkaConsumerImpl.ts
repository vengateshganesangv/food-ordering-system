import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { KafkaConsumer } from './KafkaConsumer';

export class KafkaConsumerImpl<T> {
  private consumer: Consumer;
  private kafka: Kafka;
  private messageHandler: KafkaConsumer<T>;

  constructor(
    brokers: string[],
    groupId: string,
    topics: string[],
    messageHandler: KafkaConsumer<T>,
  ) {
    this.kafka = new Kafka({
      clientId: 'food-ordering-system',
      brokers: brokers,
      retry: {
        retries: 5,
        initialRetryTime: 300,
        maxRetryTime: 30000,
      },
    });

    this.consumer = this.kafka.consumer({
      groupId: groupId,
      sessionTimeout: 10000,
      heartbeatInterval: 3000,
    });

    this.messageHandler = messageHandler;
    this.setupConsumer(topics);
  }

  private async setupConsumer(topics: string[]): Promise<void> {
    await this.consumer.connect();

    for (const topic of topics) {
      await this.consumer.subscribe({ topic, fromBeginning: false });
    }

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        await this.handleMessage(payload);
      },
    });
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { message, partition } = payload;

    try {
      const value = message.value?.toString();
      const key = message.key?.toString();

      if (value && key) {
        const parsedMessage = JSON.parse(value) as T;
        await this.messageHandler.receive(
          [parsedMessage],
          [key],
          [partition],
          [Number(message.offset)],
        );
      }
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.consumer.disconnect();
  }
}
