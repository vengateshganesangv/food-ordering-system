import { CustomerAvroModel } from '@food-ordering-system/kafka-model';
import { CustomerCreatedEvent } from '../../domain/core/event/CustomerCreatedEvent';

export class CustomerMessagingDataMapper {
  eventToAvroModel(customerCreatedEvent: CustomerCreatedEvent): CustomerAvroModel {
    return {
      id: customerCreatedEvent.customer.id.value,
      username: customerCreatedEvent.customer.getUsername(),
      firstName: customerCreatedEvent.customer.getFirstName(),
      lastName: customerCreatedEvent.customer.getLastName(),
    };
  }
}
