"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditHistoryJpaRepository = void 0;
const typeorm_1 = require("typeorm");
class CreditHistoryJpaRepository extends typeorm_1.Repository {
    async findByCustomerId(customerId) {
        return this.find({ where: { customerId } });
    }
}
exports.CreditHistoryJpaRepository = CreditHistoryJpaRepository;
