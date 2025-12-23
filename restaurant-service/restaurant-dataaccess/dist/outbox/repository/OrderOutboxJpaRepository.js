"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderOutboxJpaRepositoryImpl = void 0;
/**
 * Custom repository implementation for OrderOutboxEntity
 * Provides custom query methods beyond standard TypeORM Repository
 */
class OrderOutboxJpaRepositoryImpl {
    constructor(repository) {
        this.repository = repository;
    }
    async findByTypeAndOutboxStatus(type, outboxStatus) {
        const results = await this.repository.find({
            where: {
                type,
                outboxStatus,
            },
        });
        return results.length > 0 ? results : undefined;
    }
    async findByTypeAndSagaIdAndOutboxStatus(type, sagaId, outboxStatus) {
        const result = await this.repository.findOne({
            where: {
                type,
                sagaId,
                outboxStatus,
            },
        });
        return result ?? undefined;
    }
    async deleteByTypeAndOutboxStatus(type, outboxStatus) {
        await this.repository.delete({
            type,
            outboxStatus,
        });
    }
    // Proxy all standard Repository methods
    save(entity) {
        return this.repository.save(entity);
    }
    find(options) {
        return this.repository.find(options);
    }
    findOne(options) {
        return this.repository.findOne(options);
    }
}
exports.OrderOutboxJpaRepositoryImpl = OrderOutboxJpaRepositoryImpl;
