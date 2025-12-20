/**
 * Custom exception for Kafka producer errors
 * Corresponds to Java's KafkaProducerException
 */
export class KafkaProducerException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KafkaProducerException';
    Object.setPrototypeOf(this, KafkaProducerException.prototype);
  }
}
