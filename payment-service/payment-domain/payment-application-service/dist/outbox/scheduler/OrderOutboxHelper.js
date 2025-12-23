"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderOutboxHelper = void 0;
const outbox_1 = require("@food-ordering-system/outbox");
const saga_1 = require("@food-ordering-system/saga");
const payment_domain_core_1 = require("@food-ordering-system/payment-domain-core");
const OrderOutboxMessage_1 = require("../model/OrderOutboxMessage");
const uuid_1 = require("uuid");
class OrderOutboxHelper {
    orderOutboxRepository;
    constructor(orderOutboxRepository) {
        this.orderOutboxRepository = orderOutboxRepository;
    }
    async getCompletedOrderOutboxMessageBySagaIdAndPaymentStatus(sagaId, paymentStatus) {
        return this.orderOutboxRepository.findByTypeAndSagaIdAndPaymentStatusAndOutboxStatus(saga_1.ORDER_SAGA_NAME, sagaId, paymentStatus, outbox_1.OutboxStatus.COMPLETED);
    }
    async getOrderOutboxMessageByOutboxStatus(outboxStatus) {
        return this.orderOutboxRepository.findByTypeAndOutboxStatus(saga_1.ORDER_SAGA_NAME, outboxStatus);
    }
    async deleteOrderOutboxMessageByOutboxStatus(outboxStatus) {
        await this.orderOutboxRepository.deleteByTypeAndOutboxStatus(saga_1.ORDER_SAGA_NAME, outboxStatus);
    }
    async saveOrderOutboxMessage(orderEventPayload, paymentStatus, outboxStatus, sagaId) {
        await this.save(OrderOutboxMessage_1.OrderOutboxMessage.builder()
            .id((0, uuid_1.v4)())
            .sagaId(sagaId)
            .createdAt(orderEventPayload.createdAt)
            .processedAt(new Date())
            .type(saga_1.ORDER_SAGA_NAME)
            .payload(this.createPayload(orderEventPayload))
            .paymentStatus(paymentStatus)
            .outboxStatus(outboxStatus)
            .build());
    }
    async updateOutboxMessage(orderOutboxMessage, outboxStatus) {
        orderOutboxMessage.setOutboxStatus(outboxStatus);
        await this.save(orderOutboxMessage);
        console.log(`Order outbox table status is updated as: ${outboxStatus}`);
    }
    createPayload(orderEventPayload) {
        try {
            return JSON.stringify(orderEventPayload);
        }
        catch (e) {
            const error = e;
            console.error('Could not create OrderEventPayload json!', error);
            throw new payment_domain_core_1.PaymentDomainException('Could not create OrderEventPayload json!', error);
        }
    }
    async save(orderOutboxMessage) {
        const response = await this.orderOutboxRepository.save(orderOutboxMessage);
        if (!response) {
            console.error('Could not save OrderOutboxMessage!');
            throw new payment_domain_core_1.PaymentDomainException('Could not save OrderOutboxMessage!');
        }
        console.log(`OrderOutboxMessage is saved with id: ${orderOutboxMessage.id}`);
    }
}
exports.OrderOutboxHelper = OrderOutboxHelper;
//# sourceMappingURL=OrderOutboxHelper.js.map