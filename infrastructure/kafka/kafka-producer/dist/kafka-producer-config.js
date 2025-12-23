"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaProducerConfig = void 0;
const kafkajs_1 = require("kafkajs");
const kafka_producer_impl_1 = require("./service/kafka-producer-impl");
const logger_1 = require("./logger");
/**
 * Kafka producer configuration
 * Creates and configures Kafka producer instances
 */
class KafkaProducerConfig {
    constructor(kafkaConfigData, kafkaProducerConfigData) {
        this.kafkaConfigData = kafkaConfigData;
        this.kafkaProducerConfigData = kafkaProducerConfigData;
        this.logger = new logger_1.Logger('KafkaProducerConfig');
    }
    /**
     * Create producer configuration object for KafkaJS
     */
    getProducerConfig() {
        const compressionType = this.getCompressionType(this.kafkaProducerConfigData.getCompressionType());
        return {
            retry: {
                retries: this.kafkaProducerConfigData.getRetryCount(),
                initialRetryTime: 100,
                factor: 2,
                multiplier: 2,
                maxRetryTime: this.kafkaProducerConfigData.getRequestTimeoutMs()
            },
            compression: compressionType,
            idempotent: this.kafkaProducerConfigData.getAcks() === 'all',
            maxInFlightRequests: this.kafkaProducerConfigData.getAcks() === 'all' ? 5 : 1,
            transactionalId: undefined,
            allowAutoTopicCreation: false,
            requestTimeout: this.kafkaProducerConfigData.getRequestTimeoutMs()
        };
    }
    /**
     * Create Kafka instance
     */
    createKafka() {
        const brokers = this.kafkaConfigData.getBootstrapServers().split(',');
        return new kafkajs_1.Kafka({
            clientId: 'food-ordering-producer',
            brokers: brokers,
            logLevel: kafkajs_1.logLevel.INFO,
            retry: {
                retries: this.kafkaProducerConfigData.getRetryCount(),
                initialRetryTime: 100
            },
            // Add schema registry configuration if needed
            // This would require additional library like @kafkajs/confluent-schema-registry
        });
    }
    /**
     * Create producer instance
     */
    createProducer(valueSerializer) {
        const kafka = this.createKafka();
        return new kafka_producer_impl_1.KafkaProducerImpl(kafka, valueSerializer);
    }
    /**
     * Map compression type string to KafkaJS CompressionTypes
     */
    getCompressionType(compressionType) {
        switch (compressionType.toLowerCase()) {
            case 'gzip':
                return kafkajs_1.CompressionTypes.GZIP;
            case 'snappy':
                return kafkajs_1.CompressionTypes.Snappy;
            case 'lz4':
                return kafkajs_1.CompressionTypes.LZ4;
            case 'zstd':
                return kafkajs_1.CompressionTypes.ZSTD;
            default:
                return kafkajs_1.CompressionTypes.None;
        }
    }
    /**
     * Get Kafka configuration data
     */
    getKafkaConfigData() {
        return this.kafkaConfigData;
    }
    /**
     * Get Kafka producer configuration data
     */
    getKafkaProducerConfigData() {
        return this.kafkaProducerConfigData;
    }
}
exports.KafkaProducerConfig = KafkaProducerConfig;
