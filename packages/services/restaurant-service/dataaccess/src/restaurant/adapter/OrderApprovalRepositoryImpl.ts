import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { OrderApproval, OrderApprovalId } from '@food-ordering-system/restaurant-domain-core';
import { OrderApprovalRepository } from '@food-ordering-system/restaurant-application-service';
import { OrderApprovalEntity } from '../entity/OrderApprovalEntity';
import { RestaurantId, OrderId } from '@food-ordering-system/common-domain';

@injectable()
export class OrderApprovalRepositoryImpl implements OrderApprovalRepository {
  private repository: Repository<OrderApprovalEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = dataSource.getRepository(OrderApprovalEntity);
  }

  async save(orderApproval: OrderApproval): Promise<OrderApproval> {
    const entity = this.orderApprovalToEntity(orderApproval);
    const saved = await this.repository.save(entity);
    return this.entityToOrderApproval(saved);
  }

  private orderApprovalToEntity(orderApproval: OrderApproval): OrderApprovalEntity {
    const entity = new OrderApprovalEntity();
    entity.id = orderApproval.getId()!.getValue();
    entity.restaurantId = orderApproval.restaurantId.getValue();
    entity.orderId = orderApproval.orderId.getValue();
    entity.status = orderApproval.approvalStatus;
    return entity;
  }

  private entityToOrderApproval(entity: OrderApprovalEntity): OrderApproval {
    return OrderApproval.builder()
      .setOrderApprovalId(new OrderApprovalId(entity.id))
      .setRestaurantId(new RestaurantId(entity.restaurantId))
      .setOrderId(new OrderId(entity.orderId))
      .setApprovalStatus(entity.status)
      .build();
  }
}
