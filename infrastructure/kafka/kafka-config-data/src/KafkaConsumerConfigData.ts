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
