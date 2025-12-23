"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderOutboxCleanerScheduler = void 0;
const outbox_1 = require("@food-ordering-system/outbox");
const kafka_producer_1 = require("@food-ordering-system/kafka-producer");
const logger = new kafka_producer_1.Logger('OrderOutboxCleanerScheduler');
class OrderOutboxCleanerScheduler {
    constructor(orderOutboxHelper) {
        this.orderOutboxHelper = orderOutboxHelper;
    }
    async processOutboxMessage() {
        const outboxMessages = await this.orderOutboxHelper.getOrderOutboxMessageByOutboxStatus(outbox_1.OutboxStatus.COMPLETED);
        if (outboxMessages && outboxMessages.length > 0) {
            logger.info(`Received ${outboxMessages.length} OrderOutboxMessage for clean-up!`);
            await this.orderOutboxHelper.deleteOrderOutboxMessageByOutboxStatus(outbox_1.OutboxStatus.COMPLETED);
            logger.info(`Deleted ${outboxMessages.length} OrderOutboxMessage!`);
        }
    }
}
exports.OrderOutboxCleanerScheduler = OrderOutboxCleanerScheduler;
