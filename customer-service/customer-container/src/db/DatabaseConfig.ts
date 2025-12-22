import { DataSource } from 'typeorm';
import { CustomerEntity } from '@food-ordering-system/customer-dataaccess';
import { AppConfig } from '../config/ConfigLoader';

/**
 * Database Configuration
 * Creates and configures TypeORM DataSource
 */
export class DatabaseConfig {
  /**
   * Creates a TypeORM DataSource from application configuration
   * @param config - Application configuration
   * @returns Configured DataSource
   */
  static createDataSource(config: AppConfig): DataSource {
    // Parse JDBC URL to extract connection details
    const jdbcUrl = config.datasource.url;
    const urlMatch = jdbcUrl.match(/jdbc:postgresql:\/\/([^:]+):(\d+)\/([^?]+)\?currentSchema=([^&]+)/);

    if (!urlMatch) {
      throw new Error(`Invalid JDBC URL format: ${jdbcUrl}`);
    }

    const [, host, port, database, schema] = urlMatch;

    return new DataSource({
      type: 'postgres',
      host: host,
      port: parseInt(port, 10),
      username: config.datasource.username,
      password: config.datasource.password,
      database: database,
      schema: schema,
      entities: [CustomerEntity],
      synchronize: false, // Don't auto-create schema, use init-schema.sql instead
      logging: false,
    });
  }

  /**
   * Initializes the database connection
   * @param dataSource - TypeORM DataSource
   * @returns Promise that resolves when connection is established
   */
  static async initialize(dataSource: DataSource): Promise<void> {
    try {
      await dataSource.initialize();
      console.log('Database connection established successfully');
    } catch (error) {
      console.error('Error connecting to database:', error);
      throw error;
    }
  }
}
