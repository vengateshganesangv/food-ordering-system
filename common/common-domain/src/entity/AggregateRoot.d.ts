import { BaseEntity } from './BaseEntity';
/**
 * Aggregate root marker class in DDD
 * Aggregates are a cluster of domain objects that can be treated as a single unit
 * @template ID - The type of the aggregate root's identifier
 */
export declare abstract class AggregateRoot<ID> extends BaseEntity<ID> {
}
