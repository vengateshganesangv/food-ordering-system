import { Request, Response } from 'express';
import { CreateOrderCommand } from '../application-service/dto/CreateOrderCommand';
import { CreateOrderResponse } from '../application-service/dto/CreateOrderResponse';
import { v4 as uuidv4 } from 'uuid';

export class OrderController {
  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { customerId, restaurantId, items, price } = req.body;

      const command = new CreateOrderCommand(customerId, restaurantId, items, price);

      // Simplified implementation - in real scenario this would call the application service
      const response = new CreateOrderResponse(
        uuidv4(),
        'PENDING',
        'Order created successfully',
      );

      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getOrder(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      res.status(200).json({ orderId, status: 'PENDING', message: 'Order found' });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
