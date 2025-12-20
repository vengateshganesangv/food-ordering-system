import express from 'express';
import dotenv from 'dotenv';
import { DependencyInjection } from './config/DependencyInjection';
import { config } from './config/ServiceConfig';

dotenv.config();

const app = express();
app.use(express.json());

const di = DependencyInjection.getInstance();
const customerController = di.getCustomerController();

// Routes
app.post('/customers', (req, res) => customerController.createCustomer(req, res));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Start server
const startServer = async () => {
  try {
    await di.connectKafka();
    console.log('Kafka producer connected');

    app.listen(config.port, () => {
      console.log(`Customer Service running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await di.close();
  process.exit(0);
});

startServer();
