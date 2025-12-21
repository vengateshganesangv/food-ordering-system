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
