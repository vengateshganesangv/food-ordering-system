"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaProducerImpl = void 0;
const kafka_producer_exception_1 = require("../exception/kafka-producer-exception");
const logger_1 = require("../logger");
/**
 * Kafka producer implementation using KafkaJS
 */
class KafkaProducerImpl {
    constructor(kafka, valueSerializer) {
        this.kafka = kafka;
        this.valueSerializer = valueSerializer;
        this.logger = new logger_1.Logger('KafkaProducerImpl');
        this.isConnected = false;
        this.producer = kafka.producer();
    }
    /**
     * Connect to Kafka (lazy initialization)
     */
    async connect() {
        if (!this.isConnected) {
            await this.producer.connect();
            this.isConnected = true;
            this.logger.info('Kafka producer connected successfully');
        }
    }
    /**
     * Send message to Kafka topic
     */
    async send(topicName, key, message, callback) {
        this.logger.info(`Sending message to topic=${topicName}`, { message });
        try {
            await this.connect();
            // Serialize key and value
            const keyBuffer = this.serializeKey(key);
            const valueBuffer = this.serializeValue(message);
            const record = {
                topic: topicName,
                messages: [
                    {
                        key: keyBuffer,
                        value: valueBuffer
                    }
                ]
            };
            const result = await this.producer.send(record);
            // KafkaJS returns an array of RecordMetadata
            if (result && result.length > 0) {
                const metadata = result[0];
                callback.onSuccess({
                    topic: metadata.topicName,
                    partition: metadata.partition,
                    offset: metadata.offset.toString(),
                    timestamp: metadata.baseOffset?.toString() || Date.now().toString()
                });
            }
        }
        catch (error) {
            this.logger.error(`Error on kafka producer with key: ${key}, message: ${JSON.stringify(message)}`, error);
            const kafkaError = error instanceof Error ? error : new Error(String(error));
            callback.onFailure(kafkaError);
            throw new kafka_producer_exception_1.KafkaProducerException(`Error on kafka producer with key: ${key} and message: ${JSON.stringify(message)}`);
        }
    }
    /**
     * Serialize key to buffer
     */
    serializeKey(key) {
        if (typeof key === 'string') {
            return Buffer.from(key);
        }
        return Buffer.from(JSON.stringify(key));
    }
    /**
     * Serialize value to buffer
     */
    serializeValue(value) {
        if (this.valueSerializer) {
            return this.valueSerializer(value);
        }
        // Default: JSON serialization
        return Buffer.from(JSON.stringify(value));
    }
    /**
     * Disconnect producer
     */
    async disconnect() {
        if (this.isConnected) {
            this.logger.info('Closing kafka producer!');
            await this.producer.disconnect();
            this.isConnected = false;
        }
    }
}
exports.KafkaProducerImpl = KafkaProducerImpl;
