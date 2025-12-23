"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderApprovalRepositoryImpl = void 0;
/**
 * Order Approval Repository Implementation
 * Adapter that implements the OrderApprovalRepository output port
 * Uses TypeORM for database operations
 */
class OrderApprovalRepositoryImpl {
    constructor(orderApprovalJpaRepository, restaurantDataAccessMapper) {
        this.orderApprovalJpaRepository = orderApprovalJpaRepository;
        this.restaurantDataAccessMapper = restaurantDataAccessMapper;
    }
    /**
     * Save order approval to database
     * @param orderApproval Domain order approval entity
     * @returns Saved domain order approval entity
     */
    async save(orderApproval) {
        const entity = this.restaurantDataAccessMapper.orderApprovalToOrderApprovalEntity(orderApproval);
        const savedEntity = await this.orderApprovalJpaRepository.save(entity);
        return this.restaurantDataAccessMapper.orderApprovalEntityToOrderApproval(savedEntity);
    }
}
exports.OrderApprovalRepositoryImpl = OrderApprovalRepositoryImpl;
