export class PaymentServiceConfigData {
  constructor(
    public paymentRequestTopicName: string,
    public paymentResponseTopicName: string,
    public outboxSchedulerFixedRate: number,
    public outboxSchedulerInitialDelay: number
  ) {}
}
