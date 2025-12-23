import { OutboxScheduler } from '@food-ordering-system/outbox';
import { OrderOutboxHelper } from './OrderOutboxHelper';
import { Logger } from '@food-ordering-system/kafka-producer';
/**
 * Order Outbox Cleaner Scheduler
 * Cleans up COMPLETED outbox messages
 * Runs daily at midnight
 */
export declare class OrderOutboxCleanerScheduler implements OutboxScheduler {
    private readonly orderOutboxHelper;
    private readonly logger;
    constructor(orderOutboxHelper: OrderOutboxHelper, logger?: Logger);
    /**
     * Process outbox message cleanup
     * Deletes COMPLETED outbox messages
     * Scheduled to run at midnight (cron: @midnight)
     */
    processOutboxMessage(): Promise<void>;
}
//# sourceMappingURL=OrderOutboxCleanerScheduler.d.ts.map