import { Kafka } from 'kafkajs';
import { DatabaseClient } from '@food-ordering/common-dataaccess';
import { KafkaProducerImpl } from '@food-ordering/kafka-producer';
import { CustomerDomainServiceImpl } from '../domain-core/CustomerDomainServiceImpl';
import { CustomerDataMapper } from '../application-service/mapper/CustomerDataMapper';
import { CustomerDataAccessMapper } from '../dataaccess/mapper/CustomerDataAccessMapper';
import { CustomerRepositoryImpl } from '../dataaccess/repository/CustomerRepositoryImpl';
import { CustomerCreatedEventKafkaPublisher } from '../messaging/publisher/CustomerCreatedEventKafkaPublisher';
import { CustomerCreateCommandHandler } from '../application-service/CustomerCreateCommandHandler';
import { CustomerApplicationServiceImpl } from '../application-service/CustomerApplicationServiceImpl';
import { CustomerController } from '../api/CustomerController';
import { config } from './ServiceConfig';

export class DependencyInjection {
  private static instance: DependencyInjection;

  private customerController!: CustomerController;
  private databaseClient!: DatabaseClient;
  private kafkaProducer!: KafkaProducerImpl<string, unknown>;

  private constructor() {
    this.initialize();
  }

  static getInstance(): DependencyInjection {
    if (!DependencyInjection.instance) {
      DependencyInjection.instance = new DependencyInjection();
    }
    return DependencyInjection.instance;
  }

  private initialize(): void {
    // Database
    this.databaseClient = new DatabaseClient(config.database);

    // Kafka
    const kafka = new Kafka({
      clientId: 'customer-service',
      brokers: [config.kafka.bootstrapServers],
    });
    this.kafkaProducer = new KafkaProducerImpl(kafka);

    // Domain
    const customerDomainService = new CustomerDomainServiceImpl();

    // Mappers
    const customerDataMapper = new CustomerDataMapper();
    const customerDataAccessMapper = new CustomerDataAccessMapper();

    // Repository
    const customerRepository = new CustomerRepositoryImpl(
      this.databaseClient,
      customerDataAccessMapper,
    );

    // Messaging
    const customerMessagePublisher = new CustomerCreatedEventKafkaPublisher(
      this.kafkaProducer,
      config.kafka.customerTopic,
    );

    // Application Service
    const customerCreateCommandHandler = new CustomerCreateCommandHandler(
      customerDomainService,
      customerRepository,
      customerDataMapper,
    );

    const customerApplicationService = new CustomerApplicationServiceImpl(
      customerCreateCommandHandler,
      customerDataMapper,
      customerMessagePublisher,
    );

    // Controller
    this.customerController = new CustomerController(customerApplicationService);
  }

  getCustomerController(): CustomerController {
    return this.customerController;
  }

  async connectKafka(): Promise<void> {
    await this.kafkaProducer.connect();
  }

  async close(): Promise<void> {
    await this.databaseClient.close();
    await this.kafkaProducer.disconnect();
  }
}
