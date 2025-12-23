"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderOutboxRepositoryImpl = void 0;
const OrderOutboxNotFoundException_1 = require("../exception/OrderOutboxNotFoundException");
class OrderOutboxRepositoryImpl {
    constructor(orderOutboxJpaRepository, orderOutboxDataAccessMapper) {
        this.orderOutboxJpaRepository = orderOutboxJpaRepository;
        this.orderOutboxDataAccessMapper = orderOutboxDataAccessMapper;
    }
    async save(orderOutboxMessage) {
        const entity = this.orderOutboxDataAccessMapper.orderOutboxMessageToOutboxEntity(orderOutboxMessage);
        const savedEntity = await this.orderOutboxJpaRepository.save(entity);
        return this.orderOutboxDataAccessMapper.orderOutboxEntityToOrderOutboxMessage(savedEntity);
    }
    async findByTypeAndOutboxStatus(type, outboxStatus) {
        const entities = await this.orderOutboxJpaRepository.findByTypeAndOutboxStatus(type, outboxStatus);
        if (!entities || entities.length === 0) {
            throw new OrderOutboxNotFoundException_1.OrderOutboxNotFoundException(`Approval outbox object cannot be found for saga type ${type}`);
        }
        return entities.map(entity => this.orderOutboxDataAccessMapper.orderOutboxEntityToOrderOutboxMessage(entity));
    }
    async findByTypeAndSagaIdAndPaymentStatusAndOutboxStatus(type, sagaId, paymentStatus, outboxStatus) {
        const entity = await this.orderOutboxJpaRepository.findByTypeAndSagaIdAndPaymentStatusAndOutboxStatus(type, sagaId, paymentStatus, outboxStatus);
        return entity ? this.orderOutboxDataAccessMapper.orderOutboxEntityToOrderOutboxMessage(entity) : null;
    }
    async deleteByTypeAndOutboxStatus(type, outboxStatus) {
        await this.orderOutboxJpaRepository.deleteByTypeAndOutboxStatus(type, outboxStatus);
    }
}
exports.OrderOutboxRepositoryImpl = OrderOutboxRepositoryImpl;
