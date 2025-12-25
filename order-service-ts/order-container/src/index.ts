import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ConfigLoader } from './config/ConfigLoader';
import { DependencyContainer } from './di/DependencyContainer';
import { Application } from './app/Application';
import { Logger } from '@food-ordering-system/kafka-producer';

// Import entities
import {
  OrderEntity,
  OrderItemEntity,
  OrderAddressEntity,
  CustomerEntity,
  PaymentOutboxEntity,
  ApprovalOutboxEntity,
} from '@food-ordering-system/order-dataaccess';

const logger = new Logger('OrderServiceMain');

async function bootstrap() {
  try {
    logger.info('Starting Order Service...');

    // Load configuration
    const configLoader = new ConfigLoader();
    const config = configLoader.getConfig();

    logger.info(`Loaded configuration for port ${config.server.port}`);

    // Initialize TypeORM DataSource
    const dataSource = new DataSource({
      type: 'postgres',
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.database,
      schema: config.database.schema,
      synchronize: false, // Set to false in production
      logging: true,
      entities: [
        OrderEntity,
        OrderItemEntity,
        OrderAddressEntity,
        CustomerEntity,
        PaymentOutboxEntity,
        ApprovalOutboxEntity,
      ],
    });

    logger.info('Initializing database connection...');
    await dataSource.initialize();
    logger.info('Database connection established');

    // Initialize Dependency Container
    logger.info('Initializing dependency container...');
    const container = new DependencyContainer(dataSource, config);
    logger.info('Dependency container initialized');

    // Start Kafka Consumers
    logger.info('Starting Kafka consumers...');
    await container.startKafkaConsumers();
    logger.info('Kafka consumers started');

    // Create and start Express Application
    logger.info('Starting Express application...');
    const application = new Application(container);
    application.start(config.server.port);

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully...`);

      try {
        await container.shutdown();
        process.exit(0);
      } catch (error) {
        logger.error(`Error during shutdown: ${(error as Error).message}`);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    logger.info(`Order Service started successfully on port ${config.server.port}`);
  } catch (error) {
    logger.error(`Failed to start Order Service: ${(error as Error).message}`);
    logger.error((error as Error).stack || '');
    process.exit(1);
  }
}

bootstrap();
