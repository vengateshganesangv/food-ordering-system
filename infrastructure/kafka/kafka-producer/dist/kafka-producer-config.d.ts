import { Kafka } from 'kafkajs';
import { KafkaConfigData } from '../../../kafka-config-data/src/kafka-config-data';
import { KafkaProducerConfigData } from '../../../kafka-config-data/src/kafka-producer-config-data';
import { KafkaProducerImpl } from './service/kafka-producer-impl';
/**
 * Kafka producer configuration
 * Creates and configures Kafka producer instances
 */
export declare class KafkaProducerConfig<K, V> {
    private kafkaConfigData;
    private kafkaProducerConfigData;
    private logger;
    constructor(kafkaConfigData: KafkaConfigData, kafkaProducerConfigData: KafkaProducerConfigData);
    /**
     * Create producer configuration object for KafkaJS
     */
    getProducerConfig(): any;
    /**
     * Create Kafka instance
     */
    createKafka(): Kafka;
    /**
     * Create producer instance
     */
    createProducer(valueSerializer?: (value: V) => Buffer): KafkaProducerImpl<K, V>;
    /**
     * Map compression type string to KafkaJS CompressionTypes
     */
    private getCompressionType;
    /**
     * Get Kafka configuration data
     */
    getKafkaConfigData(): KafkaConfigData;
    /**
     * Get Kafka producer configuration data
     */
    getKafkaProducerConfigData(): KafkaProducerConfigData;
}
