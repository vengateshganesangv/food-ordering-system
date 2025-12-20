export class KafkaMessageHelper {
  static getOrderEventPayload<T>(payload: T, outboxStatus: string): string {
    return JSON.stringify({
      payload,
      outboxStatus,
    });
  }
}
