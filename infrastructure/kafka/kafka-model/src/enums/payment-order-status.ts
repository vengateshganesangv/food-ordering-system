/**
 * Payment order status enum
 * Avro enum: PENDING, CANCELLED
 */
export enum PaymentOrderStatus {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED'
}

/**
 * Avro schema for PaymentOrderStatus
 */
export const PaymentOrderStatusSchema = {
  type: 'enum',
  name: 'PaymentOrderStatus',
  namespace: 'com.food.ordering.system.kafka.order.avro.model',
  symbols: ['PENDING', 'CANCELLED']
};
