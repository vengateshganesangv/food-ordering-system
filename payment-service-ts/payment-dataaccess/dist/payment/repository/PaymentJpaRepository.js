"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentJpaRepository = void 0;
const typeorm_1 = require("typeorm");
class PaymentJpaRepository extends typeorm_1.Repository {
    async findByOrderId(orderId) {
        return this.findOne({ where: { orderId } });
    }
}
exports.PaymentJpaRepository = PaymentJpaRepository;
