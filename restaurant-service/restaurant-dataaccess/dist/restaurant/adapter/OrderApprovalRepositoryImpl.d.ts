import { Repository } from 'typeorm';
import { OrderApproval } from '@food-ordering-system/restaurant-domain-core';
import { OrderApprovalRepository } from '@food-ordering-system/restaurant-application-service';
import { OrderApprovalEntity } from '../entity/OrderApprovalEntity';
import { RestaurantDataAccessMapper } from '../mapper/RestaurantDataAccessMapper';
/**
 * Order Approval Repository Implementation
 * Adapter that implements the OrderApprovalRepository output port
 * Uses TypeORM for database operations
 */
export declare class OrderApprovalRepositoryImpl implements OrderApprovalRepository {
    private readonly orderApprovalJpaRepository;
    private readonly restaurantDataAccessMapper;
    constructor(orderApprovalJpaRepository: Repository<OrderApprovalEntity>, restaurantDataAccessMapper: RestaurantDataAccessMapper);
    /**
     * Save order approval to database
     * @param orderApproval Domain order approval entity
     * @returns Saved domain order approval entity
     */
    save(orderApproval: OrderApproval): Promise<OrderApproval>;
}
