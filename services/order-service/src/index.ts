import express from 'express';
import dotenv from 'dotenv';
import { OrderController } from './api/OrderController';
import { config } from './config/ServiceConfig';

dotenv.config();

const app = express();
app.use(express.json());

const orderController = new OrderController();

// Routes
app.post('/orders', (req, res) => orderController.createOrder(req, res));
app.get('/orders/:orderId', (req, res) => orderController.getOrder(req, res));
app.get('/health', (req, res) => res.status(200).json({ status: 'UP' }));

app.listen(config.port, () => {
  console.log(`Order Service running on port ${config.port}`);
});
