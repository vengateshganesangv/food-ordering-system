import { OutboxStatus } from '@food-ordering-system/outbox';
import { OrderOutboxMessage } from '../../../../outbox/model/OrderOutboxMessage';
export interface PaymentResponseMessagePublisher {
    publish(orderOutboxMessage: OrderOutboxMessage, outboxCallback: (message: OrderOutboxMessage, status: OutboxStatus) => Promise<void>): Promise<void>;
}
//# sourceMappingURL=PaymentResponseMessagePublisher.d.ts.map