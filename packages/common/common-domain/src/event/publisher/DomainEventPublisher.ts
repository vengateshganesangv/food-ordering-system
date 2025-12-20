import { DomainEvent } from '../DomainEvent';

export interface DomainEventPublisher<T extends DomainEvent<unknown>> {
  publish(domainEvent: T): void;
}
