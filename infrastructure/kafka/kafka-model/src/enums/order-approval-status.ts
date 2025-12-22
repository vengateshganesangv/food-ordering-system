/**
 * Order approval status enum
 * Avro enum: APPROVED, REJECTED
 */
export enum OrderApprovalStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

/**
 * Avro schema for OrderApprovalStatus
 */
export const OrderApprovalStatusSchema = {
  type: 'enum',
  name: 'OrderApprovalStatus',
  namespace: 'com.food.ordering.system.kafka.order.avro.model',
  symbols: ['APPROVED', 'REJECTED']
};
