import { CustomerCreatedEvent } from '../../../../core/event/CustomerCreatedEvent';

export interface CustomerMessagePublisher {
  publish(customerCreatedEvent: CustomerCreatedEvent): Promise<void>;
}
