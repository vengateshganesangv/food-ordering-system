"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditHistoryRepositoryImpl = void 0;
class CreditHistoryRepositoryImpl {
    constructor(creditHistoryJpaRepository, creditHistoryDataAccessMapper) {
        this.creditHistoryJpaRepository = creditHistoryJpaRepository;
        this.creditHistoryDataAccessMapper = creditHistoryDataAccessMapper;
    }
    async save(creditHistory) {
        const entity = this.creditHistoryDataAccessMapper.creditHistoryToCreditHistoryEntity(creditHistory);
        const savedEntity = await this.creditHistoryJpaRepository.save(entity);
        return this.creditHistoryDataAccessMapper.creditHistoryEntityToCreditHistory(savedEntity);
    }
    async findByCustomerId(customerId) {
        const entities = await this.creditHistoryJpaRepository.findByCustomerId(customerId.getValue());
        return entities.map(entity => this.creditHistoryDataAccessMapper.creditHistoryEntityToCreditHistory(entity));
    }
}
exports.CreditHistoryRepositoryImpl = CreditHistoryRepositoryImpl;
