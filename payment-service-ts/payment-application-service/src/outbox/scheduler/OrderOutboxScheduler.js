"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderOutboxScheduler = void 0;
const outbox_1 = require("@food-ordering-system/outbox");
const kafka_producer_1 = require("@food-ordering-system/kafka-producer");
const logger = new kafka_producer_1.Logger('OrderOutboxScheduler');
class OrderOutboxScheduler {
    constructor(orderOutboxHelper, paymentResponseMessagePublisher) {
        this.orderOutboxHelper = orderOutboxHelper;
        this.paymentResponseMessagePublisher = paymentResponseMessagePublisher;
    }
    async processOutboxMessage() {
        const outboxMessages = await this.orderOutboxHelper.getOrderOutboxMessageByOutboxStatus(outbox_1.OutboxStatus.STARTED);
        if (outboxMessages && outboxMessages.length > 0) {
            logger.info(`Received ${outboxMessages.length} OrderOutboxMessage with ids ${outboxMessages.map(m => m.id).join(',')}, sending to message bus!`);
            outboxMessages.forEach(orderOutboxMessage => {
                this.paymentResponseMessagePublisher.publish(orderOutboxMessage, this.orderOutboxHelper.updateOutboxMessage.bind(this.orderOutboxHelper));
            });
            logger.info(`${outboxMessages.length} OrderOutboxMessage sent to message bus!`);
        }
    }
}
exports.OrderOutboxScheduler = OrderOutboxScheduler;
