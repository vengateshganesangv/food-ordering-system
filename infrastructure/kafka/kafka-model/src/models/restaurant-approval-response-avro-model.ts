import { OrderApprovalStatus, OrderApprovalStatusSchema } from '../enums/order-approval-status';

/**
 * Restaurant Approval Response Avro Model
 * Represents a restaurant approval response in Kafka messages
 */
export interface RestaurantApprovalResponseAvroModel {
  id: string;
  sagaId: string;
  restaurantId: string;
  orderId: string;
  createdAt: number; // timestamp-millis (long)
  orderApprovalStatus: OrderApprovalStatus;
  failureMessages: string[];
}

/**
 * Avro schema for RestaurantApprovalResponseAvroModel
 */
export const RestaurantApprovalResponseAvroModelSchema = {
  type: 'record',
  name: 'RestaurantApprovalResponseAvroModel',
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
      name: 'createdAt',
      type: {
        type: 'long',
        logicalType: 'timestamp-millis'
      }
    },
    {
      name: 'orderApprovalStatus',
      type: OrderApprovalStatusSchema
    },
    {
      name: 'failureMessages',
      type: {
        type: 'array',
        items: {
          type: 'string',
          'avro.java.string': 'String'
        }
      }
    }
  ]
};
