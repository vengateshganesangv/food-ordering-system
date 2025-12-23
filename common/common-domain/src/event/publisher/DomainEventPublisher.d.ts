import { DomainEvent } from '../DomainEvent';
/**
 * Interface for publishing domain events
 * @template T - The type of domain event that extends DomainEvent
 */
export interface DomainEventPublisher<T extends DomainEvent<unknown>> {
    /**
     * Publishes a domain event
     * @param domainEvent - The domain event to publish
     */
    publish(domainEvent: T): void;
}
