/**
 * Marker interface for domain events
 * Domain events are events that domain experts care about
 * @template T - The type of the event payload
 */
export interface DomainEvent<T> {
  // Phantom field to satisfy TypeScript's unused type parameter check
  // This field is never actually used but allows the generic type to be preserved
  _phantom?: T;
}
