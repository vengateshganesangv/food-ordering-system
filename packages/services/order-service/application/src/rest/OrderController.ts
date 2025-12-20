import { Router, Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { OrderApplicationService, CreateOrderCommand, TrackOrderQuery } from '@food-ordering-system/order-application-service';

export class OrderController {
  private router: Router;
  private orderApplicationService: OrderApplicationService;

  constructor() {
    this.router = Router();
    this.orderApplicationService = container.resolve<OrderApplicationService>('OrderApplicationService');
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post('/', this.createOrder.bind(this));
    this.router.get('/:trackingId', this.getOrderByTrackingId.bind(this));
  }

  private async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createOrderCommand: CreateOrderCommand = req.body;
      console.log('Creating order for customer:', createOrderCommand.customerId, 'at restaurant:', createOrderCommand.restaurantId);
      
      const createOrderResponse = await this.orderApplicationService.createOrder(createOrderCommand);
      console.log('Order created with tracking id:', createOrderResponse.orderTrackingId);
      
      res.status(200).json(createOrderResponse);
    } catch (error) {
      next(error);
    }
  }

  private async getOrderByTrackingId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const trackingId = req.params.trackingId;
      const trackOrderQuery = new TrackOrderQuery(trackingId);
      
      const trackOrderResponse = await this.orderApplicationService.trackOrder(trackOrderQuery);
      console.log('Returning order status with tracking id:', trackOrderResponse.orderTrackingId);
      
      res.status(200).json(trackOrderResponse);
    } catch (error) {
      next(error);
    }
  }

  getRouter(): Router {
    return this.router;
  }
}
