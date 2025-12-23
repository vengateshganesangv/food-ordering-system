import { PaymentStatus } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { OrderEventPayload } from '../model/OrderEventPayload';
import { OrderOutboxMessage } from '../model/OrderOutboxMessage';
import { OrderOutboxRepository } from '../../ports/output/repository/OrderOutboxRepository';
export declare class OrderOutboxHelper {
    private readonly orderOutboxRepository;
    constructor(orderOutboxRepository: OrderOutboxRepository);
    getCompletedOrderOutboxMessageBySagaIdAndPaymentStatus(sagaId: string, paymentStatus: PaymentStatus): Promise<OrderOutboxMessage | null>;
    getOrderOutboxMessageByOutboxStatus(outboxStatus: OutboxStatus): Promise<OrderOutboxMessage[] | null>;
    deleteOrderOutboxMessageByOutboxStatus(outboxStatus: OutboxStatus): Promise<void>;
    saveOrderOutboxMessage(orderEventPayload: OrderEventPayload, paymentStatus: PaymentStatus, outboxStatus: OutboxStatus, sagaId: string): Promise<void>;
    updateOutboxMessage(orderOutboxMessage: OrderOutboxMessage, outboxStatus: OutboxStatus): Promise<void>;
    private createPayload;
    private save;
}
//# sourceMappingURL=OrderOutboxHelper.d.ts.map