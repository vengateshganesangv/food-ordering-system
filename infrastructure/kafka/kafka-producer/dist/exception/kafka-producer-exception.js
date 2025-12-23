"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaProducerException = void 0;
/**
 * Custom exception for Kafka producer errors
 */
class KafkaProducerException extends Error {
    constructor(message) {
        super(message);
        this.name = 'KafkaProducerException';
        Object.setPrototypeOf(this, KafkaProducerException.prototype);
    }
}
exports.KafkaProducerException = KafkaProducerException;
