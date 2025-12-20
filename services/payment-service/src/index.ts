import express from 'express';
import dotenv from 'dotenv';
import { PaymentController } from './api/PaymentController';
import { config } from './config/ServiceConfig';

dotenv.config();

const app = express();
app.use(express.json());

const paymentController = new PaymentController();

// Routes
app.post('/payments', (req, res) => paymentController.processPayment(req, res));
app.get('/payments/:paymentId', (req, res) => paymentController.getPayment(req, res));
app.get('/health', (req, res) => res.status(200).json({ status: 'UP' }));

app.listen(config.port, () => {
  console.log(`Payment Service running on port ${config.port}`);
});
