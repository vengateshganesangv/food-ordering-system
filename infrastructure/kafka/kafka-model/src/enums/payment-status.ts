/**
 * Payment status enum
 * Avro enum: COMPLETED, CANCELLED, FAILED
 */
export enum PaymentStatus {
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED'
}

/**
 * Avro schema for PaymentStatus
 */
export const PaymentStatusSchema = {
  type: 'enum',
  name: 'PaymentStatus',
  namespace: 'com.food.ordering.system.kafka.order.avro.model',
  symbols: ['COMPLETED', 'CANCELLED', 'FAILED']
};
