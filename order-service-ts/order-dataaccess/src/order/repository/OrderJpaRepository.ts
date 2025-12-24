import { Repository } from 'typeorm';
import { OrderEntity } from '../entity/OrderEntity';

export class OrderJpaRepository {
  constructor(private repository: Repository<OrderEntity>) {}

  async save(orderEntity: OrderEntity): Promise<OrderEntity> {
    return this.repository.save(orderEntity);
  }

  async findById(id: string): Promise<OrderEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['address', 'items'],
    });
  }

  async findByTrackingId(trackingId: string): Promise<OrderEntity | null> {
    return this.repository.findOne({
      where: { trackingId },
      relations: ['address', 'items'],
    });
  }
}
