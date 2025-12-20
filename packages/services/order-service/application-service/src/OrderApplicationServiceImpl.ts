import { injectable } from 'tsyringe';
import { validate } from 'class-validator';
import { OrderApplicationService } from './ports/input/service/OrderApplicationService';
import { CreateOrderCommand } from './dto/create/CreateOrderCommand';
import { CreateOrderResponse } from './dto/create/CreateOrderResponse';
import { TrackOrderQuery } from './dto/track/TrackOrderQuery';
import { TrackOrderResponse } from './dto/track/TrackOrderResponse';
import { OrderCreateCommandHandler } from './OrderCreateCommandHandler';
import { OrderTrackCommandHandler } from './OrderTrackCommandHandler';

@injectable()
export class OrderApplicationServiceImpl implements OrderApplicationService {
  constructor(
    private orderCreateCommandHandler: OrderCreateCommandHandler,
    private orderTrackCommandHandler: OrderTrackCommandHandler
  ) {}

  async createOrder(createOrderCommand: CreateOrderCommand): Promise<CreateOrderResponse> {
    const errors = await validate(createOrderCommand);
    if (errors.length > 0) {
      throw new Error('Validation failed: ' + errors.map(e => Object.values(e.constraints || {}).join(', ')).join('; '));
    }
    return this.orderCreateCommandHandler.createOrder(createOrderCommand);
  }

  async trackOrder(trackOrderQuery: TrackOrderQuery): Promise<TrackOrderResponse> {
    const errors = await validate(trackOrderQuery);
    if (errors.length > 0) {
      throw new Error('Validation failed: ' + errors.map(e => Object.values(e.constraints || {}).join(', ')).join('; '));
    }
    return this.orderTrackCommandHandler.trackOrder(trackOrderQuery);
  }
}
