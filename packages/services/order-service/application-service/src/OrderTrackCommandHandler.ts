import { injectable, inject } from 'tsyringe';
import { TrackOrderQuery } from './dto/track/TrackOrderQuery';
import { TrackOrderResponse } from './dto/track/TrackOrderResponse';
import { OrderDataMapper } from './mapper/OrderDataMapper';
import { OrderRepository } from './ports/output/repository/OrderRepository';
import { TrackingId, OrderNotFoundException } from '@food-ordering-system/order-domain-core';

@injectable()
export class OrderTrackCommandHandler {
  constructor(
    private orderDataMapper: OrderDataMapper,
    @inject('OrderRepository') private orderRepository: OrderRepository
  ) {}

  async trackOrder(trackOrderQuery: TrackOrderQuery): Promise<TrackOrderResponse> {
    const orderResult = await this.orderRepository.findByTrackingId(
      new TrackingId(trackOrderQuery.orderTrackingId)
    );
    
    if (!orderResult) {
      console.warn('Could not find order with tracking id:', trackOrderQuery.orderTrackingId);
      throw new OrderNotFoundException('Could not find order with tracking id: ' + trackOrderQuery.orderTrackingId);
    }
    
    return this.orderDataMapper.orderToTrackOrderResponse(orderResult);
  }
}
