import 'reflect-metadata';
import { Container } from 'inversify';
import { DataSource } from 'typeorm';
import { CustomerDomainService, CustomerDomainServiceImpl } from '@food-ordering-system/customer-service-domain-core';
import {
  CustomerApplicationService,
  CustomerApplicationServiceImpl,
  CustomerCreateCommandHandler,
  CustomerDataMapper,
  TYPES,
} from '@food-ordering-system/customer-service-application-service';
import {
  CustomerRepositoryImpl,
  CustomerDataAccessMapper,
} from '@food-ordering-system/customer-service-dataaccess';
import {
  CustomerCreatedEventKafkaPublisher,
  CustomerMessagingDataMapper,
} from '@food-ordering-system/customer-service-messaging';

export class CustomerServiceContainer {
  private static container: Container;

  static async initialize(dataSource: DataSource, kafkaProducer: any, customerTopicName: string): Promise<Container> {
    const container = new Container();

    // Register DataSource
    container.bind<DataSource>(TYPES.DataSource).toConstantValue(dataSource);

    // Register Kafka Infrastructure
    container.bind<any>('KafkaProducer').toConstantValue(kafkaProducer);
    container.bind<string>('CustomerTopicName').toConstantValue(customerTopicName);

    // Register Domain Service
    container.bind<CustomerDomainService>(TYPES.CustomerDomainService).to(CustomerDomainServiceImpl);

    // Register Application Service Layer
    container.bind<CustomerApplicationService>(TYPES.CustomerApplicationService).to(CustomerApplicationServiceImpl);
    container.bind<CustomerCreateCommandHandler>(TYPES.CustomerCreateCommandHandler).to(CustomerCreateCommandHandler);
    container.bind<CustomerDataMapper>(TYPES.CustomerDataMapper).to(CustomerDataMapper);

    // Register Data Access Layer
    container.bind<CustomerDataAccessMapper>(TYPES.CustomerDataAccessMapper).to(CustomerDataAccessMapper);
    container.bind(TYPES.CustomerRepository).to(CustomerRepositoryImpl);

    // Register Messaging Layer
    container.bind<CustomerMessagingDataMapper>(TYPES.CustomerMessagingDataMapper).to(CustomerMessagingDataMapper);
    container.bind(TYPES.CustomerMessagePublisher).to(CustomerCreatedEventKafkaPublisher);

    console.log('Customer Service Container initialized successfully');

    this.container = container;
    return container;
  }

  static getContainer(): Container {
    if (!this.container) {
      throw new Error('Container not initialized. Call initialize() first.');
    }
    return this.container;
  }
}
