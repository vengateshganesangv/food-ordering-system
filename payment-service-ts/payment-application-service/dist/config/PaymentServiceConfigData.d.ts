export declare class PaymentServiceConfigData {
    paymentRequestTopicName: string;
    paymentResponseTopicName: string;
    outboxSchedulerFixedRate: number;
    outboxSchedulerInitialDelay: number;
    constructor(paymentRequestTopicName: string, paymentResponseTopicName: string, outboxSchedulerFixedRate: number, outboxSchedulerInitialDelay: number);
}
