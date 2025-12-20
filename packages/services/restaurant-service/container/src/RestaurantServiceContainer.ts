import 'reflect-metadata';
import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { Kafka, Consumer, Producer } from 'kafkajs';

// Domain Core
import { RestaurantDomainService, RestaurantDomainServiceImpl } from '@food-ordering-system/restaurant-domain-core';

// Application Service
import {
  RestaurantApprovalRequestMessageListener,
  RestaurantApprovalRequestMessageListenerImpl,
  RestaurantApprovalRequestHelper,
  RestaurantDataMapper,
  OrderOutboxHelper,
  RestaurantRepository,
  OrderApprovalRepository,
  OrderOutboxRepository,
  RestaurantApprovalResponseMessagePublisher,
} from '@food-ordering-system/restaurant-application-service';

// Dataaccess
import {
  OrderApprovalEntity,
  OrderOutboxEntity,
  RestaurantRepositoryImpl,
  OrderApprovalRepositoryImpl,
  OrderOutboxRepositoryImpl,
} from '@food-ordering-system/restaurant-dataaccess';

// Messaging
import {
  RestaurantMessagingDataMapper,
  RestaurantApprovalRequestKafkaListener,
  RestaurantApprovalEventKafkaPublisher,
} from '@food-ordering-system/restaurant-messaging';

export class RestaurantServiceContainer {
  private dataSource!: DataSource;
  private kafka!: Kafka;
  private consumer!: Consumer;
  private producer!: Producer;

  async initialize(config: {
    database: {
      host: string;
      port: number;
      username: string;
      password: string;
      database: string;
    };
    kafka: {
      brokers: string[];
      clientId: string;
      consumerGroupId: string;
    };
    topics: {
      restaurantApprovalRequestTopic: string;
      restaurantApprovalResponseTopic: string;
    };
  }): Promise<void> {
    // Initialize Database
    this.dataSource = new DataSource({
      type: 'postgres',
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.database,
      entities: [OrderApprovalEntity, OrderOutboxEntity],
      synchronize: false,
      logging: false,
    });

    await this.dataSource.initialize();
    console.log('Database connection initialized');

    // Initialize Kafka
    this.kafka = new Kafka({
      clientId: config.kafka.clientId,
      brokers: config.kafka.brokers,
    });

    this.consumer = this.kafka.consumer({ groupId: config.kafka.consumerGroupId });
    this.producer = this.kafka.producer();

    await this.consumer.connect();
    await this.producer.connect();
    console.log('Kafka connection initialized');

    // Register dependencies
    this.registerDependencies(config);

    // Start Kafka listener
    await this.startKafkaListener(config.topics.restaurantApprovalRequestTopic, config.kafka.consumerGroupId);
  }

  private registerDependencies(config: {
    topics: {
      restaurantApprovalRequestTopic: string;
      restaurantApprovalResponseTopic: string;
    };
  }): void {
    // Register DataSource
    container.registerInstance(DataSource, this.dataSource);

    // Register Kafka
    container.registerInstance<Consumer>('KafkaConsumer', this.consumer);
    container.registerInstance<Producer>('KafkaProducer', this.producer);
    container.registerInstance<string>('RestaurantApprovalResponseTopicName', config.topics.restaurantApprovalResponseTopic);

    // Register Domain Service
    container.register<RestaurantDomainService>('RestaurantDomainService', {
      useClass: RestaurantDomainServiceImpl,
    });

    // Register Repositories
    container.register<RestaurantRepository>('RestaurantRepository', {
      useClass: RestaurantRepositoryImpl,
    });
    container.register<OrderApprovalRepository>('OrderApprovalRepository', {
      useClass: OrderApprovalRepositoryImpl,
    });
    container.register<OrderOutboxRepository>('OrderOutboxRepository', {
      useClass: OrderOutboxRepositoryImpl,
    });

    // Register Publisher
    container.register<RestaurantApprovalResponseMessagePublisher>('RestaurantApprovalResponseMessagePublisher', {
      useClass: RestaurantApprovalEventKafkaPublisher,
    });

    // Register Application Service Components
    container.registerSingleton(RestaurantDataMapper);
    container.registerSingleton(OrderOutboxHelper);
    container.registerSingleton(RestaurantApprovalRequestHelper);

    // Register Listener
    container.register<RestaurantApprovalRequestMessageListener>('RestaurantApprovalRequestMessageListener', {
      useClass: RestaurantApprovalRequestMessageListenerImpl,
    });

    // Register Messaging Components
    container.registerSingleton(RestaurantMessagingDataMapper);
    container.registerSingleton(RestaurantApprovalRequestKafkaListener);

    console.log('Dependencies registered');
  }

  private async startKafkaListener(topic: string, groupId: string): Promise<void> {
    const listener = container.resolve(RestaurantApprovalRequestKafkaListener);
    await listener.listen(topic, groupId);
  }

  async shutdown(): Promise<void> {
    await this.consumer.disconnect();
    await this.producer.disconnect();
    await this.dataSource.destroy();
    console.log('Restaurant Service shutdown complete');
  }
}
