import { Kafka, RecordMetadata } from 'kafkajs';
import { IKafkaProducer } from './kafka-producer.interface';
/**
 * Kafka producer implementation using KafkaJS
 */
export declare class KafkaProducerImpl<K, V> implements IKafkaProducer<K, V> {
    private kafka;
    private valueSerializer?;
    private producer;
    private logger;
    private isConnected;
    constructor(kafka: Kafka, valueSerializer?: ((value: V) => Buffer) | undefined);
    /**
     * Connect to Kafka (lazy initialization)
     */
    private connect;
    /**
     * Send message to Kafka topic
     */
    send(topicName: string, key: K, message: V, callback: {
        onSuccess: (metadata: RecordMetadata) => void;
        onFailure: (error: Error) => void;
    }): Promise<void>;
    /**
     * Serialize key to buffer
     */
    private serializeKey;
    /**
     * Serialize value to buffer
     */
    private serializeValue;
    /**
     * Disconnect producer
     */
    disconnect(): Promise<void>;
}
