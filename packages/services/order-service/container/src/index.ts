import express from 'express';
import { DataSource } from 'typeorm';
import { OrderServiceContainer } from './OrderServiceContainer';
import { OrderController } from '@food-ordering-system/order-application';

const app = express();
app.use(express.json());

async function bootstrap() {
  // Initialize TypeORM DataSource
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'order_db',
    entities: ['**/entity/*.ts'],
    synchronize: false,
  });

  await dataSource.initialize();
  console.log('Database connection initialized');

  // Initialize DI container
  await OrderServiceContainer.initialize(dataSource);

  // Setup routes
  const orderController = new OrderController();
  app.use('/api/v1/orders', orderController.getRouter());

  // Start server
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log('Order Service started on port:', port);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start Order Service:', error);
  process.exit(1);
});

export { app };
