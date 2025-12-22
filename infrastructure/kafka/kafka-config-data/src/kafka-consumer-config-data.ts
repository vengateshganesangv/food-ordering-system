/**
 * Kafka consumer configuration data
 * Equivalent to Spring Boot's @ConfigurationProperties(prefix = "kafka-consumer-config")
 */
export class KafkaConsumerConfigData {
  private keyDeserializer: string;
  private valueDeserializer: string;
  private autoOffsetReset: string;
  private specificAvroReaderKey: string;
  private specificAvroReader: string;
  private batchListener: boolean;
  private autoStartup: boolean;
  private concurrencyLevel: number;
  private sessionTimeoutMs: number;
  private heartbeatIntervalMs: number;
  private maxPollIntervalMs: number;
  private pollTimeoutMs: number;
  private maxPollRecords: number;
  private maxPartitionFetchBytesDefault: number;
  private maxPartitionFetchBytesBoostFactor: number;

  constructor(
    keyDeserializer: string = process.env.KAFKA_CONSUMER_KEY_DESERIALIZER || 'org.apache.kafka.common.serialization.StringDeserializer',
    valueDeserializer: string = process.env.KAFKA_CONSUMER_VALUE_DESERIALIZER || 'io.confluent.kafka.serializers.KafkaAvroDeserializer',
    autoOffsetReset: string = process.env.KAFKA_CONSUMER_AUTO_OFFSET_RESET || 'earliest',
    specificAvroReaderKey: string = process.env.KAFKA_CONSUMER_SPECIFIC_AVRO_READER_KEY || 'specific.avro.reader',
    specificAvroReader: string = process.env.KAFKA_CONSUMER_SPECIFIC_AVRO_READER || 'true',
    batchListener: boolean = process.env.KAFKA_CONSUMER_BATCH_LISTENER === 'true' || true,
    autoStartup: boolean = process.env.KAFKA_CONSUMER_AUTO_STARTUP !== 'false',
    concurrencyLevel: number = parseInt(process.env.KAFKA_CONSUMER_CONCURRENCY_LEVEL || '3', 10),
    sessionTimeoutMs: number = parseInt(process.env.KAFKA_CONSUMER_SESSION_TIMEOUT_MS || '10000', 10),
    heartbeatIntervalMs: number = parseInt(process.env.KAFKA_CONSUMER_HEARTBEAT_INTERVAL_MS || '3000', 10),
    maxPollIntervalMs: number = parseInt(process.env.KAFKA_CONSUMER_MAX_POLL_INTERVAL_MS || '300000', 10),
    pollTimeoutMs: number = parseInt(process.env.KAFKA_CONSUMER_POLL_TIMEOUT_MS || '150', 10),
    maxPollRecords: number = parseInt(process.env.KAFKA_CONSUMER_MAX_POLL_RECORDS || '500', 10),
    maxPartitionFetchBytesDefault: number = parseInt(process.env.KAFKA_CONSUMER_MAX_PARTITION_FETCH_BYTES_DEFAULT || '1048576', 10),
    maxPartitionFetchBytesBoostFactor: number = parseInt(process.env.KAFKA_CONSUMER_MAX_PARTITION_FETCH_BYTES_BOOST_FACTOR || '1', 10)
  ) {
    this.keyDeserializer = keyDeserializer;
    this.valueDeserializer = valueDeserializer;
    this.autoOffsetReset = autoOffsetReset;
    this.specificAvroReaderKey = specificAvroReaderKey;
    this.specificAvroReader = specificAvroReader;
    this.batchListener = batchListener;
    this.autoStartup = autoStartup;
    this.concurrencyLevel = concurrencyLevel;
    this.sessionTimeoutMs = sessionTimeoutMs;
    this.heartbeatIntervalMs = heartbeatIntervalMs;
    this.maxPollIntervalMs = maxPollIntervalMs;
    this.pollTimeoutMs = pollTimeoutMs;
    this.maxPollRecords = maxPollRecords;
    this.maxPartitionFetchBytesDefault = maxPartitionFetchBytesDefault;
    this.maxPartitionFetchBytesBoostFactor = maxPartitionFetchBytesBoostFactor;
  }

  getKeyDeserializer(): string {
    return this.keyDeserializer;
  }

  setKeyDeserializer(keyDeserializer: string): void {
    this.keyDeserializer = keyDeserializer;
  }

  getValueDeserializer(): string {
    return this.valueDeserializer;
  }

  setValueDeserializer(valueDeserializer: string): void {
    this.valueDeserializer = valueDeserializer;
  }

  getAutoOffsetReset(): string {
    return this.autoOffsetReset;
  }

  setAutoOffsetReset(autoOffsetReset: string): void {
    this.autoOffsetReset = autoOffsetReset;
  }

  getSpecificAvroReaderKey(): string {
    return this.specificAvroReaderKey;
  }

  setSpecificAvroReaderKey(specificAvroReaderKey: string): void {
    this.specificAvroReaderKey = specificAvroReaderKey;
  }

  getSpecificAvroReader(): string {
    return this.specificAvroReader;
  }

  setSpecificAvroReader(specificAvroReader: string): void {
    this.specificAvroReader = specificAvroReader;
  }

  getBatchListener(): boolean {
    return this.batchListener;
  }

  setBatchListener(batchListener: boolean): void {
    this.batchListener = batchListener;
  }

  getAutoStartup(): boolean {
    return this.autoStartup;
  }

  setAutoStartup(autoStartup: boolean): void {
    this.autoStartup = autoStartup;
  }

  getConcurrencyLevel(): number {
    return this.concurrencyLevel;
  }

  setConcurrencyLevel(concurrencyLevel: number): void {
    this.concurrencyLevel = concurrencyLevel;
  }

  getSessionTimeoutMs(): number {
    return this.sessionTimeoutMs;
  }

  setSessionTimeoutMs(sessionTimeoutMs: number): void {
    this.sessionTimeoutMs = sessionTimeoutMs;
  }

  getHeartbeatIntervalMs(): number {
    return this.heartbeatIntervalMs;
  }

  setHeartbeatIntervalMs(heartbeatIntervalMs: number): void {
    this.heartbeatIntervalMs = heartbeatIntervalMs;
  }

  getMaxPollIntervalMs(): number {
    return this.maxPollIntervalMs;
  }

  setMaxPollIntervalMs(maxPollIntervalMs: number): void {
    this.maxPollIntervalMs = maxPollIntervalMs;
  }

  getPollTimeoutMs(): number {
    return this.pollTimeoutMs;
  }

  setPollTimeoutMs(pollTimeoutMs: number): void {
    this.pollTimeoutMs = pollTimeoutMs;
  }

  getMaxPollRecords(): number {
    return this.maxPollRecords;
  }

  setMaxPollRecords(maxPollRecords: number): void {
    this.maxPollRecords = maxPollRecords;
  }

  getMaxPartitionFetchBytesDefault(): number {
    return this.maxPartitionFetchBytesDefault;
  }

  setMaxPartitionFetchBytesDefault(maxPartitionFetchBytesDefault: number): void {
    this.maxPartitionFetchBytesDefault = maxPartitionFetchBytesDefault;
  }

  getMaxPartitionFetchBytesBoostFactor(): number {
    return this.maxPartitionFetchBytesBoostFactor;
  }

  setMaxPartitionFetchBytesBoostFactor(maxPartitionFetchBytesBoostFactor: number): void {
    this.maxPartitionFetchBytesBoostFactor = maxPartitionFetchBytesBoostFactor;
  }
}
