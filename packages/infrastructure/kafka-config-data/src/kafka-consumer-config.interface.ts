/**
 * Kafka consumer configuration interface
 * Corresponds to Java's KafkaConsumerConfigData class
 */
export interface KafkaConsumerConfigData {
  keyDeserializer: string;
  valueDeserializer: string;
  autoOffsetReset: 'earliest' | 'latest' | 'none';
  specificAvroReaderKey: string;
  specificAvroReader: string;
  batchListener: boolean;
  autoStartup: boolean;
  concurrencyLevel: number;
  sessionTimeoutMs: number;
  heartbeatIntervalMs: number;
  maxPollIntervalMs: number;
  pollTimeoutMs: number;
  maxPollRecords: number;
  maxPartitionFetchBytesDefault: number;
  maxPartitionFetchBytesBoostFactor: number;
}
