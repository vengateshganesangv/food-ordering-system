import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Kafka } from 'kafkajs';
import { ConfigLoader } from './ConfigLoader';
import { RestaurantServiceConfigData } from '@food-ordering-system/restaurant-application-service';

// Common Data Access
import { RestaurantEntity } from '@food-ordering-system/common-dataaccess';

// Domain
import { RestaurantDomainService, RestaurantDomainServiceImpl } from '@food-ordering-system/restaurant-domain-core';

// Application Service
import {
  RestaurantApprovalRequestMessageListener,
  RestaurantApprovalRequestMessageListenerImpl,
  RestaurantApprovalRequestHelper,
  RestaurantDataMapper,
  OrderOutboxHelper,
  OrderOutboxScheduler,
  OrderOutboxCleanerScheduler,
  RestaurantApprovalResponseMessagePublisher,
  OrderApprovalRepository,
  RestaurantRepository,
  OrderOutboxRepository,
} from '@food-ordering-system/restaurant-application-service';

// Data Access
import {
  OrderApprovalEntity,
  OrderOutboxEntity,
  OrderApprovalRepositoryImpl,
  RestaurantRepositoryImpl,
  OrderOutboxRepositoryImpl,
  RestaurantDataAccessMapper,
  OrderOutboxDataAccessMapper,
  OrderOutboxJpaRepositoryImpl,
} from '@food-ordering-system/restaurant-dataaccess';

// Messaging
import {
  RestaurantApprovalRequestKafkaListener,
  RestaurantApprovalEventKafkaPublisher,
  RestaurantMessagingDataMapper,
} from '@food-ordering-system/restaurant-messaging';

import { KafkaProducerImpl, KafkaMessageHelper } from '@food-ordering-system/kafka-producer';

export class DependencyContainer {
  private static orderOutboxScheduler: OrderOutboxScheduler;
  private static orderOutboxCleanerScheduler: OrderOutboxCleanerScheduler;

  public static async setup(): Promise<void> {
    const config = ConfigLoader.getConfig();

    // Register configuration
    const restaurantServiceConfig: RestaurantServiceConfigData = {
      restaurantApprovalRequestTopicName: config.restaurantService.restaurantApprovalRequestTopicName,
      restaurantApprovalResponseTopicName: config.restaurantService.restaurantApprovalResponseTopicName,
    };

    // Setup DataSource for TypeORM
    const dataSource = new DataSource({
      type: 'postgres',
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.database,
      schema: config.database.schema,
      entities: [OrderApprovalEntity, OrderOutboxEntity, RestaurantEntity],
      synchronize: false,
      logging: config.logging.level.root === 'DEBUG',
    });

    await dataSource.initialize();

    // Register repositories
    const orderApprovalJpaRepository = dataSource.getRepository(OrderApprovalEntity);
    const orderOutboxEntityRepository = dataSource.getRepository(OrderOutboxEntity);
    const restaurantEntityRepository = dataSource.getRepository(RestaurantEntity);

    // Create OrderOutboxJpaRepository with custom methods
    const orderOutboxJpaRepository = new OrderOutboxJpaRepositoryImpl(orderOutboxEntityRepository);

    // Register mappers
    const restaurantDataAccessMapper = new RestaurantDataAccessMapper();
    const orderOutboxDataAccessMapper = new OrderOutboxDataAccessMapper();

    // Register repository implementations
    const orderApprovalRepository: OrderApprovalRepository = new OrderApprovalRepositoryImpl(
      orderApprovalJpaRepository,
      restaurantDataAccessMapper,
    );

    const restaurantRepository: RestaurantRepository = new RestaurantRepositoryImpl(
      restaurantEntityRepository,
      restaurantDataAccessMapper,
    );

    const orderOutboxRepository: OrderOutboxRepository = new OrderOutboxRepositoryImpl(
      orderOutboxJpaRepository,
      orderOutboxDataAccessMapper,
    );

    // Register domain service
    const restaurantDomainService: RestaurantDomainService = new RestaurantDomainServiceImpl();

    // Register application service components
    const restaurantDataMapper = new RestaurantDataMapper();
    const orderOutboxHelper = new OrderOutboxHelper(orderOutboxRepository, restaurantDataMapper);

    // Setup Kafka
    const kafka = new Kafka({
      clientId: 'restaurant-service',
      brokers: config.kafkaConfig.bootstrapServers,
    });

    const kafkaProducer = new KafkaProducerImpl(kafka);
    const kafkaMessageHelper = new KafkaMessageHelper();

    const restaurantMessagingDataMapper = new RestaurantMessagingDataMapper();

    const restaurantApprovalResponseMessagePublisher: RestaurantApprovalResponseMessagePublisher =
      new RestaurantApprovalEventKafkaPublisher(
        restaurantMessagingDataMapper,
        kafkaProducer,
        restaurantServiceConfig,
        kafkaMessageHelper,
      );

    const restaurantApprovalRequestHelper = new RestaurantApprovalRequestHelper(
      restaurantDomainService,
      restaurantDataMapper,
      restaurantRepository,
      orderApprovalRepository,
      orderOutboxHelper,
    );

    const restaurantApprovalRequestMessageListener: RestaurantApprovalRequestMessageListener =
      new RestaurantApprovalRequestMessageListenerImpl(restaurantApprovalRequestHelper);

    // Store schedulers as class properties
    this.orderOutboxScheduler = new OrderOutboxScheduler(orderOutboxHelper, restaurantApprovalResponseMessagePublisher);
    this.orderOutboxCleanerScheduler = new OrderOutboxCleanerScheduler(orderOutboxHelper);

    // Setup Kafka consumer
    const consumer = kafka.consumer({
      groupId: config.kafkaConsumerConfig.restaurantApprovalConsumerGroupId,
    });

    await consumer.connect();
    await consumer.subscribe({
      topic: config.restaurantService.restaurantApprovalRequestTopicName,
      fromBeginning: config.kafkaConsumerConfig.autoOffsetReset === 'earliest',
    });

    const restaurantApprovalRequestKafkaListener = new RestaurantApprovalRequestKafkaListener(
      restaurantApprovalRequestMessageListener,
      restaurantMessagingDataMapper,
    );

    await consumer.run({
      eachMessage: async (payload) => {
        await restaurantApprovalRequestKafkaListener.consume(payload);
      },
    });
  }

  public static getOrderOutboxScheduler(): OrderOutboxScheduler {
    return this.orderOutboxScheduler;
  }

  public static getOrderOutboxCleanerScheduler(): OrderOutboxCleanerScheduler {
    return this.orderOutboxCleanerScheduler;
  }
}
