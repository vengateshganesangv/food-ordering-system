import { OrderId } from '@food-ordering-system/common-domain';
import { Order, TrackingId } from '@food-ordering-system/order-domain-core';
import { OrderRepository } from '@food-ordering-system/order-application-service';
import { OrderJpaRepository } from '../repository/OrderJpaRepository';
import { OrderDataAccessMapper } from '../mapper/OrderDataAccessMapper';

export class OrderRepositoryImpl implements OrderRepository {
  constructor(
    private readonly orderJpaRepository: OrderJpaRepository,
    private readonly orderDataAccessMapper: OrderDataAccessMapper,
  ) {}

  async save(order: Order): Promise<Order> {
    const orderEntity = this.orderDataAccessMapper.orderToOrderEntity(order);
    const savedEntity = await this.orderJpaRepository.save(orderEntity);
    return this.orderDataAccessMapper.orderEntityToOrder(savedEntity);
  }

  async findById(orderId: OrderId): Promise<Order | undefined> {
    const orderEntity = await this.orderJpaRepository.findById(orderId.getValue());
    return orderEntity ? this.orderDataAccessMapper.orderEntityToOrder(orderEntity) : undefined;
  }

  async findByTrackingId(trackingId: TrackingId): Promise<Order | undefined> {
    const orderEntity = await this.orderJpaRepository.findByTrackingId(trackingId.getValue());
    return orderEntity ? this.orderDataAccessMapper.orderEntityToOrder(orderEntity) : undefined;
  }
}
