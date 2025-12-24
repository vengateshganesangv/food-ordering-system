import { OrderId } from '@food-ordering-system/common-domain';
import { Order, TrackingId } from '@food-ordering-system/order-domain-core';

/**
 * Order Repository interface
 * Output port for order persistence
 */
export interface OrderRepository {
  /**
   * Saves an order
   * @param order Order to save
   * @returns Saved order
   */
  save(order: Order): Promise<Order>;

  /**
   * Finds an order by ID
   * @param orderId Order ID
   * @returns Order if found
   */
  findById(orderId: OrderId): Promise<Order | undefined>;

  /**
   * Finds an order by tracking ID
   * @param trackingId Tracking ID
   * @returns Order if found
   */
  findByTrackingId(trackingId: TrackingId): Promise<Order | undefined>;
}
