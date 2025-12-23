"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderOutboxScheduler = void 0;
const outbox_1 = require("@food-ordering-system/outbox");
class OrderOutboxScheduler {
    orderOutboxHelper;
    paymentResponseMessagePublisher;
    constructor(orderOutboxHelper, paymentResponseMessagePublisher) {
        this.orderOutboxHelper = orderOutboxHelper;
        this.paymentResponseMessagePublisher = paymentResponseMessagePublisher;
    }
    async processOutboxMessage() {
        const outboxMessagesResponse = await this.orderOutboxHelper.getOrderOutboxMessageByOutboxStatus(outbox_1.OutboxStatus.STARTED);
        if (outboxMessagesResponse && outboxMessagesResponse.length > 0) {
            const outboxMessages = outboxMessagesResponse;
            console.log(`Received ${outboxMessages.length} OrderOutboxMessage with ids ${outboxMessages
                .map((msg) => msg.id)
                .join(',')}, sending to message bus!`);
            for (const orderOutboxMessage of outboxMessages) {
                await this.paymentResponseMessagePublisher.publish(orderOutboxMessage, this.orderOutboxHelper.updateOutboxMessage.bind(this.orderOutboxHelper));
            }
            console.log(`${outboxMessages.length} OrderOutboxMessage sent to message bus!`);
        }
    }
}
exports.OrderOutboxScheduler = OrderOutboxScheduler;
//# sourceMappingURL=OrderOutboxScheduler.js.map