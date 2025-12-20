import { injectable } from 'inversify';
import { CustomerCreatedEvent } from '@food-ordering-system/customer-service-domain-core';

export interface CustomerAvroModel {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

@injectable()
export class CustomerMessagingDataMapper {
  customerCreatedEventToAvroModel(customerCreatedEvent: CustomerCreatedEvent): CustomerAvroModel {
    return {
      id: customerCreatedEvent.customer.getId()!.getValue(),
      username: customerCreatedEvent.customer.username,
      firstName: customerCreatedEvent.customer.firstName,
      lastName: customerCreatedEvent.customer.lastName,
    };
  }
}
