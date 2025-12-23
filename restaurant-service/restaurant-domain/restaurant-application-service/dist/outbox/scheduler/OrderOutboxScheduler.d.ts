import { OutboxScheduler } from '@food-ordering-system/outbox';
import { RestaurantApprovalResponseMessagePublisher } from '../../ports/output/message/publisher/RestaurantApprovalResponseMessagePublisher';
import { OrderOutboxHelper } from './OrderOutboxHelper';
import { Logger } from '@food-ordering-system/kafka-producer';
/**
 * Order Outbox Scheduler
 * Processes STARTED outbox messages and publishes them to Kafka
 */
export declare class OrderOutboxScheduler implements OutboxScheduler {
    private readonly orderOutboxHelper;
    private readonly responseMessagePublisher;
    private readonly logger;
    constructor(orderOutboxHelper: OrderOutboxHelper, responseMessagePublisher: RestaurantApprovalResponseMessagePublisher, logger?: Logger);
    /**
     * Process outbox messages with STARTED status
     * Scheduled to run at fixed intervals
     */
    processOutboxMessage(): Promise<void>;
}
//# sourceMappingURL=OrderOutboxScheduler.d.ts.map