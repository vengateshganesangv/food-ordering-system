import express, { Application } from 'express';
import { DataSource } from 'typeorm';
import { ConfigLoader, AppConfig } from './config/ConfigLoader';
import { DatabaseConfig } from './db/DatabaseConfig';
import { BeanConfiguration } from './config/BeanConfiguration';
import { createCustomerRouter } from '@food-ordering-system/customer-application';
import { createCustomerExceptionHandler } from '@food-ordering-system/customer-application';
import { createGlobalExceptionHandler } from '@food-ordering-system/common-application';

/**
 * Customer Service Application
 * Main entry point for the Customer microservice
 */
class CustomerServiceApplication {
  private app: Application;
  private config: AppConfig;
  private dataSource: DataSource;
  private beanConfiguration: BeanConfiguration;

  constructor() {
    this.app = express();
    this.config = ConfigLoader.loadConfig();
    this.dataSource = DatabaseConfig.createDataSource(this.config);
    this.beanConfiguration = new BeanConfiguration(this.config, this.dataSource);
  }

  /**
   * Configure Express middleware
   */
  private configureMiddleware(): void {
    // Body parsing middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging middleware
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  /**
   * Configure REST routes
   */
  private configureRoutes(): void {
    // Customer routes
    const customerApplicationService = this.beanConfiguration.getCustomerApplicationService();
    const customerRouter = createCustomerRouter(customerApplicationService);
    this.app.use('/customers', customerRouter);

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'UP' });
    });
  }

  /**
   * Configure error handlers (must be last)
   */
  private configureErrorHandlers(): void {
    // Customer-specific exception handler
    this.app.use(createCustomerExceptionHandler());

    // Global exception handler (catch-all)
    this.app.use(createGlobalExceptionHandler());
  }

  /**
   * Initialize the application
   */
  async initialize(): Promise<void> {
    try {
      // Initialize database
      await DatabaseConfig.initialize(this.dataSource);

      // Configure application
      this.configureMiddleware();
      this.configureRoutes();
      this.configureErrorHandlers();

      console.log('Customer Service Application initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Customer Service Application:', error);
      throw error;
    }
  }

  /**
   * Start the application server
   */
  start(): void {
    const port = this.config.server.port;
    this.app.listen(port, () => {
      console.log(`Customer Service is running on port ${port}`);
      console.log(`Health check available at http://localhost:${port}/health`);
      console.log(`Customer API available at http://localhost:${port}/customers`);
    });
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    console.log('Shutting down Customer Service...');
    try {
      if (this.dataSource.isInitialized) {
        await this.dataSource.destroy();
        console.log('Database connection closed');
      }
    } catch (error) {
      console.error('Error during shutdown:', error);
    }
  }
}

/**
 * Main entry point
 */
async function main() {
  const app = new CustomerServiceApplication();

  try {
    await app.initialize();
    app.start();

    // Handle graceful shutdown
    process.on('SIGTERM', async () => {
      await app.shutdown();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      await app.shutdown();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start Customer Service:', error);
    process.exit(1);
  }
}

// Start the application
if (require.main === module) {
  main();
}

export { CustomerServiceApplication };
