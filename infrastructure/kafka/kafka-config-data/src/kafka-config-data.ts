/**
 * Kafka configuration data
 * Equivalent to Spring Boot's @ConfigurationProperties(prefix = "kafka-config")
 */
export class KafkaConfigData {
  private bootstrapServers: string;
  private schemaRegistryUrlKey: string;
  private schemaRegistryUrl: string;
  private numOfPartitions: number;
  private replicationFactor: number;

  constructor(
    bootstrapServers: string = process.env.KAFKA_BOOTSTRAP_SERVERS || 'localhost:9092',
    schemaRegistryUrlKey: string = process.env.KAFKA_SCHEMA_REGISTRY_URL_KEY || 'schema.registry.url',
    schemaRegistryUrl: string = process.env.KAFKA_SCHEMA_REGISTRY_URL || 'http://localhost:8081',
    numOfPartitions: number = parseInt(process.env.KAFKA_NUM_OF_PARTITIONS || '3', 10),
    replicationFactor: number = parseInt(process.env.KAFKA_REPLICATION_FACTOR || '3', 10)
  ) {
    this.bootstrapServers = bootstrapServers;
    this.schemaRegistryUrlKey = schemaRegistryUrlKey;
    this.schemaRegistryUrl = schemaRegistryUrl;
    this.numOfPartitions = numOfPartitions;
    this.replicationFactor = replicationFactor;
  }

  getBootstrapServers(): string {
    return this.bootstrapServers;
  }

  setBootstrapServers(bootstrapServers: string): void {
    this.bootstrapServers = bootstrapServers;
  }

  getSchemaRegistryUrlKey(): string {
    return this.schemaRegistryUrlKey;
  }

  setSchemaRegistryUrlKey(schemaRegistryUrlKey: string): void {
    this.schemaRegistryUrlKey = schemaRegistryUrlKey;
  }

  getSchemaRegistryUrl(): string {
    return this.schemaRegistryUrl;
  }

  setSchemaRegistryUrl(schemaRegistryUrl: string): void {
    this.schemaRegistryUrl = schemaRegistryUrl;
  }

  getNumOfPartitions(): number {
    return this.numOfPartitions;
  }

  setNumOfPartitions(numOfPartitions: number): void {
    this.numOfPartitions = numOfPartitions;
  }

  getReplicationFactor(): number {
    return this.replicationFactor;
  }

  setReplicationFactor(replicationFactor: number): void {
    this.replicationFactor = replicationFactor;
  }
}
