import { BaseEntity } from './BaseEntity';

export abstract class AggregateRoot<ID> extends BaseEntity<ID> {
  // Marker class for aggregate roots in DDD
  // Aggregate roots are the entry points for all operations on the aggregate
}
