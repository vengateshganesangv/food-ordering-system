import { OutboxScheduler } from '@food-ordering-system/outbox';
import { OrderOutboxHelper } from './OrderOutboxHelper';
export declare class OrderOutboxCleanerScheduler implements OutboxScheduler {
    private readonly orderOutboxHelper;
    constructor(orderOutboxHelper: OrderOutboxHelper);
    processOutboxMessage(): Promise<void>;
}
//# sourceMappingURL=OrderOutboxCleanerScheduler.d.ts.map