import { CreateOrderCommand } from '../../../dto/create/CreateOrderCommand';
import { CreateOrderResponse } from '../../../dto/create/CreateOrderResponse';
import { TrackOrderQuery } from '../../../dto/track/TrackOrderQuery';
import { TrackOrderResponse } from '../../../dto/track/TrackOrderResponse';

/**
 * Order Application Service interface
 * Input port for order operations
 */
export interface OrderApplicationService {
  /**
   * Creates a new order
   * @param createOrderCommand Command with order details
   * @returns Response with tracking ID and status
   */
  createOrder(createOrderCommand: CreateOrderCommand): Promise<CreateOrderResponse>;

  /**
   * Tracks an existing order
   * @param trackOrderQuery Query with tracking ID
   * @returns Response with order status
   */
  trackOrder(trackOrderQuery: TrackOrderQuery): Promise<TrackOrderResponse>;
}
