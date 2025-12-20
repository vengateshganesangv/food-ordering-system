export interface KafkaConfigData {
  bootstrapServers: string;
  schemaRegistryUrlKey: string;
  schemaRegistryUrl: string;
  numOfPartitions: number;
  replicationFactor: number;
}

export interface KafkaProducerConfigData {
  keySerializerClass: string;
  valueSerializerClass: string;
  compressionType: string;
  acks: string;
  batchSize: number;
  batchSizeBoostFactor: number;
  lingerMs: number;
  requestTimeoutMs: number;
  retryCount: number;
}

export interface KafkaConsumerConfigData {
  keyDeserializer: string;
  valueDeserializer: string;
  autoOffsetReset: string;
  specificAvroReaderKey: string;
  specificAvroReader: string;
  sessionTimeoutMs: number;
  heartbeatIntervalMs: number;
  maxPollIntervalMs: number;
  maxPartitionFetchBytesDefault: number;
  maxPartitionFetchBytesBoostFactor: number;
  maxPollRecords: number;
  batchListener: boolean;
  autoStartup: boolean;
  concurrencyLevel: number;
  pollTimeoutMs: number;
}
