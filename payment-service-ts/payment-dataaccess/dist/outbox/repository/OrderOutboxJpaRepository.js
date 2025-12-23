"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderOutboxJpaRepository = void 0;
const typeorm_1 = require("typeorm");
class OrderOutboxJpaRepository extends typeorm_1.Repository {
    async findByTypeAndOutboxStatus(type, outboxStatus) {
        return this.find({ where: { type, outboxStatus } });
    }
    async findByTypeAndSagaIdAndPaymentStatusAndOutboxStatus(type, sagaId, paymentStatus, outboxStatus) {
        return this.findOne({ where: { type, sagaId, paymentStatus, outboxStatus } });
    }
    async deleteByTypeAndOutboxStatus(type, outboxStatus) {
        await this.delete({ type, outboxStatus });
    }
}
exports.OrderOutboxJpaRepository = OrderOutboxJpaRepository;
