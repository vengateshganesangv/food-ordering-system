"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditEntryRepositoryImpl = void 0;
class CreditEntryRepositoryImpl {
    constructor(creditEntryJpaRepository, creditEntryDataAccessMapper) {
        this.creditEntryJpaRepository = creditEntryJpaRepository;
        this.creditEntryDataAccessMapper = creditEntryDataAccessMapper;
    }
    async save(creditEntry) {
        const entity = this.creditEntryDataAccessMapper.creditEntryToCreditEntryEntity(creditEntry);
        const savedEntity = await this.creditEntryJpaRepository.save(entity);
        return this.creditEntryDataAccessMapper.creditEntryEntityToCreditEntry(savedEntity);
    }
    async findByCustomerId(customerId) {
        const entity = await this.creditEntryJpaRepository.findByCustomerId(customerId.getValue());
        return entity ? this.creditEntryDataAccessMapper.creditEntryEntityToCreditEntry(entity) : null;
    }
}
exports.CreditEntryRepositoryImpl = CreditEntryRepositoryImpl;
