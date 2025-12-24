import { CreateOrderCommand } from './dto/create/CreateOrderCommand';
import { CreateOrderResponse } from './dto/create/CreateOrderResponse';
import { TrackOrderQuery } from './dto/track/TrackOrderQuery';
import { TrackOrderResponse } from './dto/track/TrackOrderResponse';
import { OrderApplicationService } from './ports/input/service/OrderApplicationService';
import { OrderCreateCommandHandler } from './OrderCreateCommandHandler';
import { OrderTrackCommandHandler } from './OrderTrackCommandHandler';

/**
 * Order Application Service Implementation
 * Main entry point for order operations
 */
export class OrderApplicationServiceImpl implements OrderApplicationService {
  private static readonly logger = {
    info: (message: string, ...args: any[]) => console.log(`[OrderApplicationServiceImpl] ${message}`, ...args),
  };

  constructor(
    private readonly orderCreateCommandHandler: OrderCreateCommandHandler,
    private readonly orderTrackCommandHandler: OrderTrackCommandHandler,
  ) {}

  async createOrder(createOrderCommand: CreateOrderCommand): Promise<CreateOrderResponse> {
    return this.orderCreateCommandHandler.createOrder(createOrderCommand);
  }

  async trackOrder(trackOrderQuery: TrackOrderQuery): Promise<TrackOrderResponse> {
    return this.orderTrackCommandHandler.trackOrder(trackOrderQuery);
  }
}
