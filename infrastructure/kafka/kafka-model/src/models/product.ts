/**
 * Product model
 * Represents a product in an order
 */
export interface Product {
  id: string;
  quantity: number;
}

/**
 * Avro schema for Product
 */
export const ProductSchema = {
  type: 'record',
  name: 'Product',
  namespace: 'com.food.ordering.system.kafka.order.avro.model',
  fields: [
    {
      name: 'id',
      type: {
        type: 'string',
        'avro.java.string': 'String'
      },
      logicalType: 'uuid'
    },
    {
      name: 'quantity',
      type: 'int'
    }
  ]
};
