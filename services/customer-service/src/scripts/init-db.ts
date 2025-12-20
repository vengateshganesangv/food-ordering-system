import { DatabaseClient } from '@food-ordering/common-dataaccess';
import { config } from '../config/ServiceConfig';

const initDatabase = async () => {
  const client = new DatabaseClient(config.database);

  try {
    console.log('Initializing database schema...');

    const schema = `
      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_customers_username ON customers(username);
    `;

    await client.query(schema);
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    await client.close();
  }
};

initDatabase();
