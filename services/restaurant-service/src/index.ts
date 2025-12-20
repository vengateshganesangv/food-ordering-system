import express from 'express';
import dotenv from 'dotenv';
import { RestaurantController } from './api/RestaurantController';
import { config } from './config/ServiceConfig';

dotenv.config();

const app = express();
app.use(express.json());

const restaurantController = new RestaurantController();

// Routes
app.post('/restaurant/approve', (req, res) => restaurantController.approveOrder(req, res));
app.get('/restaurant/:restaurantId', (req, res) => restaurantController.getRestaurant(req, res));
app.get('/health', (req, res) => res.status(200).json({ status: 'UP' }));

app.listen(config.port, () => {
  console.log(`Restaurant Service running on port ${config.port}`);
});
