import { RecordMetadata } from 'kafkajs';
/**
 * Outbox status enum
 */
export declare enum OutboxStatus {
    STARTED = "STARTED",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}
/**
 * Outbox message interface
 */
export interface OutboxMessage {
    getId(): string;
    getSagaId(): string;
    getPayload(): string;
    getOutboxStatus(): OutboxStatus;
    setOutboxStatus(status: OutboxStatus): void;
}
/**
 * Helper class for Kafka message operations
 */
export declare class KafkaMessageHelper {
    private logger;
    /**
     * Parse JSON payload to typed object
     * @param payload JSON string payload
     * @param outputType Class constructor for the output type
     */
    getOrderEventPayload<T>(payload: string, outputType: new (...args: any[]) => T): T;
    /**
     * Create Kafka callback for handling send results
     * @param responseTopicName The topic name for logging
     * @param avroModel The Avro model being sent
     * @param outboxMessage The outbox message to update
     * @param outboxCallback Callback to update outbox status
     * @param orderId Order ID for logging
     * @param avroModelName Model name for logging
     */
    getKafkaCallback<T, U extends OutboxMessage>(responseTopicName: string, avroModel: T, outboxMessage: U, outboxCallback: (message: U, status: OutboxStatus) => void, orderId: string, avroModelName: string): {
        onSuccess: (metadata: RecordMetadata) => void;
        onFailure: (error: Error) => void;
    };
}
