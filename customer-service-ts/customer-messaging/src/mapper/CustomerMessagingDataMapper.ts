import { CustomerCreatedEvent } from '@food-ordering-system/customer-domain-core';
import { CustomerAvroModel } from '@food-ordering-system/kafka-model';

/**
 * Customer Messaging Data Mapper
 * Maps between domain events and Kafka Avro models
 */
export class CustomerMessagingDataMapper {
  /**
   * Converts CustomerCreatedEvent to CustomerAvroModel
   * @param customerCreatedEvent - The customer created domain event
   * @returns CustomerAvroModel for Kafka messaging
   */
  customerCreatedEventToAvroModel(customerCreatedEvent: CustomerCreatedEvent): CustomerAvroModel {
    const customer = customerCreatedEvent.getCustomer();
    return {
      id: customer.getId().getValue(),
      username: customer.getUsername(),
      firstName: customer.getFirstName(),
      lastName: customer.getLastName(),
    };
  }
}
