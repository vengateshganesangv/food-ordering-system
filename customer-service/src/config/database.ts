import { DataSource } from 'typeorm';
import { CustomerEntity } from '../dataaccess/entity/CustomerEntity';

export async function createDataSource(): Promise<DataSource> {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'postgres',
    schema: process.env.DB_SCHEMA || 'customer',
    synchronize: false,
    logging: false,
    entities: [CustomerEntity],
  });

  await dataSource.initialize();
  console.log('Database connection initialized');

  return dataSource;
}
