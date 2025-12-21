import 'reflect-metadata';
import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { createDataSource } from './config/database';
import { DependencyInjection } from './config/DependencyInjection';
import { createRoutes } from './api/routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8184;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: err.message || 'Internal server error',
  });
});

async function bootstrap() {
  try {
    // Initialize database
    const dataSource = await createDataSource();

    // Initialize dependencies
    const customerController = await DependencyInjection.initialize(dataSource);

    // Setup routes
    const routes = createRoutes(customerController);
    app.use(routes);

    // Health check
    app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({ status: 'UP' });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`Customer Service is running on port ${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM signal received: closing HTTP server');
      await DependencyInjection.shutdown();
      await dataSource.destroy();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start Customer Service:', error);
    process.exit(1);
  }
}

bootstrap();
