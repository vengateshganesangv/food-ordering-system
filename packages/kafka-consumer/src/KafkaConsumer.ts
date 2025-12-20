export interface KafkaConsumer {
  subscribe(topics: string[]): Promise<void>;
  consume(handler: (topic: string, key: string, value: string) => Promise<void>): Promise<void>;
}
