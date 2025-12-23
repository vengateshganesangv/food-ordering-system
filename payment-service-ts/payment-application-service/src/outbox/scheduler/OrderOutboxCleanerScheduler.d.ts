import { OrderOutboxHelper } from './OrderOutboxHelper';
export declare class OrderOutboxCleanerScheduler {
    private readonly orderOutboxHelper;
    constructor(orderOutboxHelper: OrderOutboxHelper);
    processOutboxMessage(): Promise<void>;
}
