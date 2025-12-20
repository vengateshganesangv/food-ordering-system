export interface OutboxScheduler {
  processOutboxMessage(): void | Promise<void>;
}
