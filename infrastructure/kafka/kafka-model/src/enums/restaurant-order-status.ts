/**
 * Restaurant order status enum
 * Avro enum: PAID
 */
export enum RestaurantOrderStatus {
  PAID = 'PAID'
}

/**
 * Avro schema for RestaurantOrderStatus
 */
export const RestaurantOrderStatusSchema = {
  type: 'enum',
  name: 'RestaurantOrderStatus',
  namespace: 'com.food.ordering.system.kafka.order.avro.model',
  symbols: ['PAID']
};
