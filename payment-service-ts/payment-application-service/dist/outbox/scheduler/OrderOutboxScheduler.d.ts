import { PaymentResponseMessagePublisher } from '../../ports/output/message/publisher/PaymentResponseMessagePublisher';
import { OrderOutboxHelper } from './OrderOutboxHelper';
export declare class OrderOutboxScheduler {
    private readonly orderOutboxHelper;
    private readonly paymentResponseMessagePublisher;
    constructor(orderOutboxHelper: OrderOutboxHelper, paymentResponseMessagePublisher: PaymentResponseMessagePublisher);
    processOutboxMessage(): Promise<void>;
}
