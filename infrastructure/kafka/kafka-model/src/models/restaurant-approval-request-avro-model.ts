import { RestaurantOrderStatus, RestaurantOrderStatusSchema } from '../enums/restaurant-order-status';
import { Product, ProductSchema } from './product';

/**
 * Restaurant Approval Request Avro Model
 * Represents a restaurant approval request in Kafka messages
 */
export interface RestaurantApprovalRequestAvroModel {
  id: string;
  sagaId: string;
  restaurantId: string;
  orderId: string;
  restaurantOrderStatus: RestaurantOrderStatus;
  products: Product[];
  price: string; // BigDecimal represented as string
  createdAt: number; // timestamp-millis (long)
}

/**
 * Avro schema for RestaurantApprovalRequestAvroModel
 */
export const RestaurantApprovalRequestAvroModelSchema = {
  type: 'record',
  name: 'RestaurantApprovalRequestAvroModel',
  namespace: 'com.food.ordering.system.kafka.order.avro.model',
  fields: [
    {
      name: 'id',
      type: {
        type: 'string',
        logicalType: 'uuid'
      }
    },
    {
      name: 'sagaId',
      type: {
        type: 'string',
        logicalType: 'uuid'
      }
    },
    {
      name: 'restaurantId',
      type: {
        type: 'string',
        logicalType: 'uuid'
      }
    },
    {
      name: 'orderId',
      type: {
        type: 'string',
        logicalType: 'uuid'
      }
    },
    {
      name: 'restaurantOrderStatus',
      type: RestaurantOrderStatusSchema
    },
    {
      name: 'products',
      type: {
        type: 'array',
        items: ProductSchema
      }
    },
    {
      name: 'price',
      type: {
        type: 'bytes',
        logicalType: 'decimal',
        precision: 10,
        scale: 2
      }
    },
    {
      name: 'createdAt',
      type: {
        type: 'long',
        logicalType: 'timestamp-millis'
      }
    }
  ]
};
