export interface KafkaConfigData {
  bootstrapServers: string;
  schemaRegistryUrlKey: string;
  schemaRegistryUrl: string;
  numOfPartitions: number;
  replicationFactor: number;
}
