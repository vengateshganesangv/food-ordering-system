/**
 * Marker interface for domain events
 * Domain events are events that domain experts care about
 * @template T - The type of the event payload
 */
export interface DomainEvent<T> {
    _phantom?: T;
}
//# sourceMappingURL=DomainEvent.d.ts.map