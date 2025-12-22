import { PaymentStatus, PaymentStatusSchema } from '../enums/payment-status';

/**
 * Payment Response Avro Model
 * Represents a payment response in Kafka messages
 */
export interface PaymentResponseAvroModel {
  id: string;
  sagaId: string;
  paymentId: string;
  customerId: string;
  orderId: string;
  price: string; // BigDecimal represented as string
  createdAt: number; // timestamp-millis (long)
  paymentStatus: PaymentStatus;
  failureMessages: string[];
}

/**
 * Avro schema for PaymentResponseAvroModel
 */
export const PaymentResponseAvroModelSchema = {
  type: 'record',
  name: 'PaymentResponseAvroModel',
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
      name: 'paymentId',
      type: {
        type: 'string',
        logicalType: 'uuid'
      }
    },
    {
      name: 'customerId',
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
    },
    {
      name: 'paymentStatus',
      type: PaymentStatusSchema
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
