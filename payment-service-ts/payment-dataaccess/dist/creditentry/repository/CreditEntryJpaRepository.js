"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditEntryJpaRepository = void 0;
const typeorm_1 = require("typeorm");
class CreditEntryJpaRepository extends typeorm_1.Repository {
    async findByCustomerId(customerId) {
        return this.findOne({ where: { customerId } });
    }
}
exports.CreditEntryJpaRepository = CreditEntryJpaRepository;
