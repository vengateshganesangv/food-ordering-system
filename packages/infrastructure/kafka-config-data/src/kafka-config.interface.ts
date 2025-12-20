/**
 * Main Kafka configuration interface
 * Corresponds to Java's KafkaConfigData class
 */
export interface KafkaConfigData {
  bootstrapServers: string;
  schemaRegistryUrlKey: string;
  schemaRegistryUrl: string;
  numOfPartitions: number;
  replicationFactor: number;
}
