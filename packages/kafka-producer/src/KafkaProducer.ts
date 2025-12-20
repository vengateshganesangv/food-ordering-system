export interface KafkaProducer<K, V> {
  send(
    topicName: string,
    key: K,
    message: V,
    callback?: (error: Error | null, messageId?: string) => void,
  ): Promise<void>;
}
