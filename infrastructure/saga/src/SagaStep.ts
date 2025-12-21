export interface SagaStep<T> {
  process(data: T): void;
  rollback(data: T): void;
}
