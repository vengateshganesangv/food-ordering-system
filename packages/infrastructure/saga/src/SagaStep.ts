export interface SagaStep<T> {
  process(data: T): void | Promise<void>;
  rollback(data: T): void | Promise<void>;
}
