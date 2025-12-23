"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderOutboxCleanerScheduler = void 0;
const outbox_1 = require("@food-ordering-system/outbox");
class OrderOutboxCleanerScheduler {
    orderOutboxHelper;
    constructor(orderOutboxHelper) {
        this.orderOutboxHelper = orderOutboxHelper;
    }
    async processOutboxMessage() {
        const outboxMessagesResponse = await this.orderOutboxHelper.getOrderOutboxMessageByOutboxStatus(outbox_1.OutboxStatus.COMPLETED);
        if (outboxMessagesResponse && outboxMessagesResponse.length > 0) {
            const outboxMessages = outboxMessagesResponse;
            console.log(`Received ${outboxMessages.length} OrderOutboxMessage for clean-up!`);
            await this.orderOutboxHelper.deleteOrderOutboxMessageByOutboxStatus(outbox_1.OutboxStatus.COMPLETED);
            console.log(`Deleted ${outboxMessages.length} OrderOutboxMessage!`);
        }
    }
}
exports.OrderOutboxCleanerScheduler = OrderOutboxCleanerScheduler;
//# sourceMappingURL=OrderOutboxCleanerScheduler.js.map