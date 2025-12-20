/**
 * Kafka producer configuration interface
 * Corresponds to Java's KafkaProducerConfigData class
 */
export interface KafkaProducerConfigData {
  keySerializerClass: string;
  valueSerializerClass: string;
  compressionType: 'gzip' | 'snappy' | 'lz4' | 'zstd' | 'none';
  acks: -1 | 0 | 1 | 'all';
  batchSize: number;
  batchSizeBoostFactor: number;
  lingerMs: number;
  requestTimeoutMs: number;
  retryCount: number;
}
