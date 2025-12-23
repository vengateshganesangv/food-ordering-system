"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaMessageHelper = exports.OutboxStatus = void 0;
const logger_1 = require("./logger");
/**
 * Outbox status enum
 */
var OutboxStatus;
(function (OutboxStatus) {
    OutboxStatus["STARTED"] = "STARTED";
    OutboxStatus["COMPLETED"] = "COMPLETED";
    OutboxStatus["FAILED"] = "FAILED";
})(OutboxStatus || (exports.OutboxStatus = OutboxStatus = {}));
/**
 * Helper class for Kafka message operations
 */
class KafkaMessageHelper {
    constructor() {
        this.logger = new logger_1.Logger('KafkaMessageHelper');
    }
    /**
     * Parse JSON payload to typed object
     * @param payload JSON string payload
     * @param outputType Class constructor for the output type
     */
    getOrderEventPayload(payload, outputType) {
        try {
            const parsed = JSON.parse(payload);
            // If outputType has a static fromJSON method, use it
            if (typeof outputType.fromJSON === 'function') {
                return outputType.fromJSON(parsed);
            }
            // Otherwise, construct directly
            return Object.assign(new outputType(), parsed);
        }
        catch (error) {
            this.logger.error(`Could not read ${outputType.name} object!`, error);
            throw new Error(`Could not read ${outputType.name} object!`);
        }
    }
    /**
     * Create Kafka callback for handling send results
     * @param responseTopicName The topic name for logging
     * @param avroModel The Avro model being sent
     * @param outboxMessage The outbox message to update
     * @param outboxCallback Callback to update outbox status
     * @param orderId Order ID for logging
     * @param avroModelName Model name for logging
     */
    getKafkaCallback(responseTopicName, avroModel, outboxMessage, outboxCallback, orderId, avroModelName) {
        return {
            onSuccess: (metadata) => {
                this.logger.info(`Received successful response from Kafka for order id: ${orderId} ` +
                    `Topic: ${metadata.topic} Partition: ${metadata.partition} ` +
                    `Offset: ${metadata.offset} Timestamp: ${metadata.timestamp}`);
                outboxCallback(outboxMessage, OutboxStatus.COMPLETED);
            },
            onFailure: (error) => {
                this.logger.error(`Error while sending ${avroModelName} with message: ${JSON.stringify(avroModel)} ` +
                    `and outbox type: ${outboxMessage.constructor.name} to topic ${responseTopicName}`, error);
                outboxCallback(outboxMessage, OutboxStatus.FAILED);
            }
        };
    }
}
exports.KafkaMessageHelper = KafkaMessageHelper;
