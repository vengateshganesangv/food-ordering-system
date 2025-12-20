export interface ServiceConfig {
  port: number;
  database: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
  };
  kafka: {
    bootstrapServers: string;
    customerTopic: string;
  };
}

export const config: ServiceConfig = {
  port: parseInt(process.env.PORT || '8081'),
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'customer_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },
  kafka: {
    bootstrapServers: process.env.KAFKA_BOOTSTRAP_SERVERS || 'localhost:9092',
    customerTopic: process.env.CUSTOMER_TOPIC || 'customer-created',
  },
};
