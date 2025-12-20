import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { OrderId } from '@food-ordering-system/common-domain';
import { Order, TrackingId } from '@food-ordering-system/order-domain-core';
import { OrderRepository } from '@food-ordering-system/order-application-service';
import { OrderEntity } from '../entity/OrderEntity';

@injectable()
export class OrderRepositoryImpl implements OrderRepository {
  private repository: Repository<OrderEntity>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(OrderEntity);
  }

  async save(order: Order): Promise<Order> {
    // Implement mapping from domain Order to OrderEntity and save
    // Then map back from OrderEntity to Order
    throw new Error('Method not implemented - mapper required');
  }

  async findById(orderId: OrderId): Promise<Order | null> {
    // Implement find by ID and map from OrderEntity to Order
    throw new Error('Method not implemented - mapper required');
  }

  async findByTrackingId(trackingId: TrackingId): Promise<Order | null> {
    // Implement find by tracking ID and map from OrderEntity to Order
    throw new Error('Method not implemented - mapper required');
  }
}
