import { CustomerCreatedEvent } from '../../../../domain-core/event/CustomerCreatedEvent';

export interface CustomerMessagePublisher {
  publish(event: CustomerCreatedEvent): void;
}
