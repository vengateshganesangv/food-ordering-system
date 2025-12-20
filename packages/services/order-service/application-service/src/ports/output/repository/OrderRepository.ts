import { OrderId } from '@food-ordering-system/common-domain';
import { Order, TrackingId } from '@food-ordering-system/order-domain-core';

export interface OrderRepository {
  save(order: Order): Promise<Order>;
  findById(orderId: OrderId): Promise<Order | null>;
  findByTrackingId(trackingId: TrackingId): Promise<Order | null>;
}
