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
export class OrderApprovalRepositoryImpl implements OrderApprovalRepository {
  constructor(
    private readonly orderApprovalJpaRepository: Repository<OrderApprovalEntity>,
    private readonly restaurantDataAccessMapper: RestaurantDataAccessMapper,
  ) {}

  /**
   * Save order approval to database
   * @param orderApproval Domain order approval entity
   * @returns Saved domain order approval entity
   */
  async save(orderApproval: OrderApproval): Promise<OrderApproval> {
    const entity = this.restaurantDataAccessMapper.orderApprovalToOrderApprovalEntity(orderApproval);
    const savedEntity = await this.orderApprovalJpaRepository.save(entity);
    return this.restaurantDataAccessMapper.orderApprovalEntityToOrderApproval(savedEntity);
  }
}
