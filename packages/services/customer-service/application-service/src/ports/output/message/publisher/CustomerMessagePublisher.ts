import { CustomerCreatedEvent } from '@food-ordering-system/customer-service-domain-core';

export interface CustomerMessagePublisher {
  publish(customerCreatedEvent: CustomerCreatedEvent): Promise<void>;
}
