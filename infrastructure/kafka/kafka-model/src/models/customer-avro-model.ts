/**
 * Customer Avro Model
 * Represents customer information in Kafka messages
 */
export interface CustomerAvroModel {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

/**
 * Avro schema for CustomerAvroModel
 */
export const CustomerAvroModelSchema = {
  type: 'record',
  name: 'CustomerAvroModel',
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
      name: 'username',
      type: {
        type: 'string',
        'avro.java.string': 'String'
      }
    },
    {
      name: 'firstName',
      type: {
        type: 'string',
        'avro.java.string': 'String'
      }
    },
    {
      name: 'lastName',
      type: {
        type: 'string',
        'avro.java.string': 'String'
      }
    }
  ]
};
