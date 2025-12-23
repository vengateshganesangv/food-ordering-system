import { OutboxScheduler } from '@food-ordering-system/outbox';
import { OrderOutboxHelper } from './OrderOutboxHelper';
import { PaymentResponseMessagePublisher } from '../../ports/output/message/publisher/PaymentResponseMessagePublisher';
export declare class OrderOutboxScheduler implements OutboxScheduler {
    private readonly orderOutboxHelper;
    private readonly paymentResponseMessagePublisher;
    constructor(orderOutboxHelper: OrderOutboxHelper, paymentResponseMessagePublisher: PaymentResponseMessagePublisher);
    processOutboxMessage(): Promise<void>;
}
//# sourceMappingURL=OrderOutboxScheduler.d.ts.map