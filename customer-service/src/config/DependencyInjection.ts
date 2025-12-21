import { DataSource } from 'typeorm';
import { KafkaProducerImpl } from '@food-ordering-system/kafka-producer';
import { CustomerAvroModel } from '@food-ordering-system/kafka-model';
import { CustomerDomainServiceImpl } from '../domain/core/CustomerDomainServiceImpl';
import { CustomerDataMapper } from '../domain/application/mapper/CustomerDataMapper';
import { CustomerApplicationServiceImpl } from '../domain/application/CustomerApplicationServiceImpl';
import { CustomerCreateCommandHandler } from '../domain/application/handler/CustomerCreateCommandHandler';
import { CustomerDataAccessMapper } from '../dataaccess/mapper/CustomerDataAccessMapper';
import { CustomerRepositoryImpl } from '../dataaccess/adapter/CustomerRepositoryImpl';
import { CustomerMessagingDataMapper } from '../messaging/mapper/CustomerMessagingDataMapper';
import { CustomerCreatedEventKafkaPublisher } from '../messaging/publisher/CustomerCreatedEventKafkaPublisher';
import { CustomerController } from '../api/CustomerController';

export class DependencyInjection {
  private static kafkaProducer: KafkaProducerImpl<string, CustomerAvroModel>;

  static async initialize(dataSource: DataSource): Promise<CustomerController> {
    // Kafka Producer
    const kafkaBrokers = (process.env.KAFKA_BROKERS || 'localhost:19092').split(',');
    this.kafkaProducer = new KafkaProducerImpl<string, CustomerAvroModel>(kafkaBrokers);
    await this.kafkaProducer.connect();

    // Mappers
    const customerDataMapper = new CustomerDataMapper();
    const customerDataAccessMapper = new CustomerDataAccessMapper();
    const customerMessagingDataMapper = new CustomerMessagingDataMapper();

    // Repository
    const customerRepository = new CustomerRepositoryImpl(dataSource, customerDataAccessMapper);

    // Message Publisher
    const topicName = process.env.CUSTOMER_TOPIC_NAME || 'customer';
    const customerMessagePublisher = new CustomerCreatedEventKafkaPublisher(
      this.kafkaProducer,
      customerMessagingDataMapper,
      topicName,
    );

    // Domain Service
    const customerDomainService = new CustomerDomainServiceImpl();

    // Command Handler
    const customerCreateCommandHandler = new CustomerCreateCommandHandler(
      customerDomainService,
      customerRepository,
      customerMessagePublisher,
      customerDataMapper,
    );

    // Application Service
    const customerApplicationService = new CustomerApplicationServiceImpl(customerCreateCommandHandler);

    // Controller
    return new CustomerController(customerApplicationService);
  }

  static async shutdown(): Promise<void> {
    if (this.kafkaProducer) {
      await this.kafkaProducer.disconnect();
    }
  }
}
