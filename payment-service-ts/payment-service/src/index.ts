import 'reflect-metadata';
import express from 'express';
import * as cron from 'node-cron';
import { container } from 'tsyringe';
import { ConfigLoader } from './config/ConfigLoader';
import { DependencyContainer } from './config/DependencyContainer';
import { logger } from '@food-ordering-system/common-domain';
import { OrderOutboxScheduler, OrderOutboxCleanerScheduler } from '@food-ordering-system/payment-application-service';

async function bootstrap() {
  try {
    // Load configuration
    const config = ConfigLoader.loadConfig();
    logger.info('Configuration loaded successfully');

    // Setup dependency injection
    await DependencyContainer.setup();
    logger.info('Dependency injection container initialized');

    // Create Express app
    const app = express();
    app.use(express.json());

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'UP', service: 'payment-service' });
    });

    // Setup schedulers using node-cron
    const orderOutboxScheduler = container.resolve<OrderOutboxScheduler>('OrderOutboxScheduler');
    const orderOutboxCleanerScheduler = container.resolve<OrderOutboxCleanerScheduler>('OrderOutboxCleanerScheduler');

    // Schedule outbox processor (every 10 seconds based on config)
    const schedulerInterval = Math.floor(config.paymentService.outboxSchedulerFixedRate / 1000);
    cron.schedule(`*/${schedulerInterval} * * * * *`, async () => {
      try {
        await orderOutboxScheduler.processOutboxMessage();
      } catch (error) {
        logger.error('Error processing outbox messages:', error);
      }
    });

    // Schedule outbox cleaner (daily at midnight)
    cron.schedule('0 0 * * *', async () => {
      try {
        await orderOutboxCleanerScheduler.processOutboxMessage();
      } catch (error) {
        logger.error('Error cleaning outbox messages:', error);
      }
    });

    logger.info('Schedulers initialized');

    // Start server
    const port = config.server.port;
    app.listen(port, () => {
      logger.info(`Payment Service is running on port ${port}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT signal received: closing HTTP server');
      process.exit(0);
    });
  } catch (error) {
    logger.error('Failed to start Payment Service:', error);
    process.exit(1);
  }
}

bootstrap();
