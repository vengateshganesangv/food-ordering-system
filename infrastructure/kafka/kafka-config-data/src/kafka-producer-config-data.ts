/**
 * Kafka producer configuration data
 * Equivalent to Spring Boot's @ConfigurationProperties(prefix = "kafka-producer-config")
 */
export class KafkaProducerConfigData {
  private keySerializerClass: string;
  private valueSerializerClass: string;
  private compressionType: string;
  private acks: string;
  private batchSize: number;
  private batchSizeBoostFactor: number;
  private lingerMs: number;
  private requestTimeoutMs: number;
  private retryCount: number;

  constructor(
    keySerializerClass: string = process.env.KAFKA_PRODUCER_KEY_SERIALIZER || 'org.apache.kafka.common.serialization.StringSerializer',
    valueSerializerClass: string = process.env.KAFKA_PRODUCER_VALUE_SERIALIZER || 'io.confluent.kafka.serializers.KafkaAvroSerializer',
    compressionType: string = process.env.KAFKA_PRODUCER_COMPRESSION_TYPE || 'snappy',
    acks: string = process.env.KAFKA_PRODUCER_ACKS || 'all',
    batchSize: number = parseInt(process.env.KAFKA_PRODUCER_BATCH_SIZE || '16384', 10),
    batchSizeBoostFactor: number = parseInt(process.env.KAFKA_PRODUCER_BATCH_SIZE_BOOST_FACTOR || '100', 10),
    lingerMs: number = parseInt(process.env.KAFKA_PRODUCER_LINGER_MS || '5', 10),
    requestTimeoutMs: number = parseInt(process.env.KAFKA_PRODUCER_REQUEST_TIMEOUT_MS || '60000', 10),
    retryCount: number = parseInt(process.env.KAFKA_PRODUCER_RETRY_COUNT || '5', 10)
  ) {
    this.keySerializerClass = keySerializerClass;
    this.valueSerializerClass = valueSerializerClass;
    this.compressionType = compressionType;
    this.acks = acks;
    this.batchSize = batchSize;
    this.batchSizeBoostFactor = batchSizeBoostFactor;
    this.lingerMs = lingerMs;
    this.requestTimeoutMs = requestTimeoutMs;
    this.retryCount = retryCount;
  }

  getKeySerializerClass(): string {
    return this.keySerializerClass;
  }

  setKeySerializerClass(keySerializerClass: string): void {
    this.keySerializerClass = keySerializerClass;
  }

  getValueSerializerClass(): string {
    return this.valueSerializerClass;
  }

  setValueSerializerClass(valueSerializerClass: string): void {
    this.valueSerializerClass = valueSerializerClass;
  }

  getCompressionType(): string {
    return this.compressionType;
  }

  setCompressionType(compressionType: string): void {
    this.compressionType = compressionType;
  }

  getAcks(): string {
    return this.acks;
  }

  setAcks(acks: string): void {
    this.acks = acks;
  }

  getBatchSize(): number {
    return this.batchSize;
  }

  setBatchSize(batchSize: number): void {
    this.batchSize = batchSize;
  }

  getBatchSizeBoostFactor(): number {
    return this.batchSizeBoostFactor;
  }

  setBatchSizeBoostFactor(batchSizeBoostFactor: number): void {
    this.batchSizeBoostFactor = batchSizeBoostFactor;
  }

  getLingerMs(): number {
    return this.lingerMs;
  }

  setLingerMs(lingerMs: number): void {
    this.lingerMs = lingerMs;
  }

  getRequestTimeoutMs(): number {
    return this.requestTimeoutMs;
  }

  setRequestTimeoutMs(requestTimeoutMs: number): void {
    this.requestTimeoutMs = requestTimeoutMs;
  }

  getRetryCount(): number {
    return this.retryCount;
  }

  setRetryCount(retryCount: number): void {
    this.retryCount = retryCount;
  }
}
