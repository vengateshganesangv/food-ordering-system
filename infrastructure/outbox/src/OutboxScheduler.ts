export interface OutboxScheduler {
  processOutboxMessage(): Promise<void>;
}
