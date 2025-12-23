"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepositoryImpl = void 0;
class PaymentRepositoryImpl {
    constructor(paymentJpaRepository, paymentDataAccessMapper) {
        this.paymentJpaRepository = paymentJpaRepository;
        this.paymentDataAccessMapper = paymentDataAccessMapper;
    }
    async save(payment) {
        const entity = this.paymentDataAccessMapper.paymentToPaymentEntity(payment);
        const savedEntity = await this.paymentJpaRepository.save(entity);
        return this.paymentDataAccessMapper.paymentEntityToPayment(savedEntity);
    }
    async findByOrderId(orderId) {
        const entity = await this.paymentJpaRepository.findByOrderId(orderId);
        return entity ? this.paymentDataAccessMapper.paymentEntityToPayment(entity) : null;
    }
}
exports.PaymentRepositoryImpl = PaymentRepositoryImpl;
