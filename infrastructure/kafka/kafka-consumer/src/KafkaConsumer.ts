export interface KafkaConsumer<T> {
  receive(messages: T[], keys: string[], partitions: number[], offsets: number[]): Promise<void>;
}
