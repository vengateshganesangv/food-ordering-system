import { TrackingId, OrderNotFoundException } from '@food-ordering-system/order-domain-core';
import { TrackOrderQuery } from './dto/track/TrackOrderQuery';
import { TrackOrderResponse } from './dto/track/TrackOrderResponse';
import { OrderDataMapper } from './mapper/OrderDataMapper';
import { OrderRepository } from './ports/output/repository/OrderRepository';

/**
 * Order Track Command Handler
 * Handles order tracking queries
 */
export class OrderTrackCommandHandler {
  private static readonly logger = {
    warn: (message: string, ...args: any[]) => console.warn(`[OrderTrackCommandHandler] ${message}`, ...args),
  };

  constructor(
    private readonly orderDataMapper: OrderDataMapper,
    private readonly orderRepository: OrderRepository,
  ) {}

  async trackOrder(trackOrderQuery: TrackOrderQuery): Promise<TrackOrderResponse> {
    const orderResult = await this.orderRepository.findByTrackingId(
      new TrackingId(trackOrderQuery.getOrderTrackingId()),
    );

    if (!orderResult) {
      OrderTrackCommandHandler.logger.warn(
        `Could not find order with tracking id: ${trackOrderQuery.getOrderTrackingId()}`,
      );
      throw new OrderNotFoundException(
        `Could not find order with tracking id: ${trackOrderQuery.getOrderTrackingId()}`,
      );
    }

    return this.orderDataMapper.orderToTrackOrderResponse(orderResult);
  }
}
