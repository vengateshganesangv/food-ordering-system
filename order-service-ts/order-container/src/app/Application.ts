import express, { Express, Request, Response, NextFunction } from 'express';
import { DependencyContainer } from '../di/DependencyContainer';
import { Logger } from '@food-ordering-system/kafka-producer';
import {
  CreateOrderCommand,
  CreateOrderResponse,
  TrackOrderQuery,
  TrackOrderResponse,
  OrderAddress,
  OrderItem,
} from '@food-ordering-system/order-application-service';

export class Application {
  private static readonly logger = new Logger('Application');
  private app: Express;

  constructor(private container: DependencyContainer) {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging middleware
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      Application.logger.info(`${req.method} ${req.path}`);
      next();
    });
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({ status: 'UP' });
    });

    // Create Order endpoint
    this.app.post('/orders', async (req: Request, res: Response) => {
      try {
        const { customerId, restaurantId, price, items, address } = req.body;

        // Validate request
        if (!customerId || !restaurantId || !price || !items || !address) {
          return res.status(400).json({
            error: 'Missing required fields: customerId, restaurantId, price, items, address',
          });
        }

        // Create OrderAddress
        const orderAddress = OrderAddress.builder()
          .street(address.street)
          .postalCode(address.postalCode)
          .city(address.city)
          .build();

        // Create OrderItems
        const orderItems = items.map((item: any) =>
          OrderItem.builder()
            .productId(item.productId)
            .quantity(item.quantity)
            .price(item.price)
            .subTotal(item.subTotal)
            .build(),
        );

        // Create command
        const createOrderCommand = CreateOrderCommand.builder()
          .customerId(customerId)
          .restaurantId(restaurantId)
          .price(price)
          .items(orderItems)
          .address(orderAddress)
          .build();

        // Execute command
        const response: CreateOrderResponse =
          await this.container.orderApplicationService.createOrder(createOrderCommand);

        Application.logger.info(
          `Order created with tracking id: ${response.getOrderTrackingId()}, order status: ${response.getOrderStatus()}`,
        );

        res.status(201).json({
          orderTrackingId: response.getOrderTrackingId(),
          orderStatus: response.getOrderStatus(),
          message: response.getMessage(),
        });
      } catch (error) {
        Application.logger.error(`Error creating order: ${(error as Error).message}`);
        res.status(500).json({
          error: 'Failed to create order',
          message: (error as Error).message,
        });
      }
    });

    // Track Order endpoint
    this.app.get('/orders/:trackingId', async (req: Request, res: Response) => {
      try {
        const { trackingId } = req.params;

        if (!trackingId) {
          return res.status(400).json({
            error: 'Missing tracking ID',
          });
        }

        // Create query
        const trackOrderQuery = TrackOrderQuery.builder().orderTrackingId(trackingId).build();

        // Execute query
        const response: TrackOrderResponse = await this.container.orderApplicationService.trackOrder(trackOrderQuery);

        Application.logger.info(`Order tracked with tracking id: ${trackingId}`);

        res.json({
          orderTrackingId: response.getOrderTrackingId(),
          orderStatus: response.getOrderStatus(),
          failureMessages: response.getFailureMessages(),
        });
      } catch (error) {
        Application.logger.error(`Error tracking order: ${(error as Error).message}`);

        if ((error as Error).name === 'OrderNotFoundException') {
          return res.status(404).json({
            error: 'Order not found',
            message: (error as Error).message,
          });
        }

        res.status(500).json({
          error: 'Failed to track order',
          message: (error as Error).message,
        });
      }
    });
  }

  private setupErrorHandling(): void {
    // 404 handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.path}`,
      });
    });

    // Global error handler
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      Application.logger.error(`Unhandled error: ${err.message}`, err.stack);
      res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
      });
    });
  }

  public getApp(): Express {
    return this.app;
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      Application.logger.info(`Order Service listening on port ${port}`);
    });
  }
}
