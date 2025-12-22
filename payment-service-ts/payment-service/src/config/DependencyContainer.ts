import 'reflect-metadata';
import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { Kafka, Consumer, Producer } from 'kafkajs';
import { ConfigLoader } from './ConfigLoader';
import { PaymentServiceConfigData } from '@food-ordering-system/payment-application-service';

// Domain
import { PaymentDomainService, PaymentDomainServiceImpl } from '@food-ordering-system/payment-domain-core';

// Application Service
import {
  PaymentRequestMessageListener,
  PaymentRequestMessageListenerImpl,
  PaymentRequestHelper,
  PaymentDataMapper,
  OrderOutboxHelper,
  OrderOutboxScheduler,
  OrderOutboxCleanerScheduler,
  PaymentResponseMessagePublisher,
  PaymentRepository,
  CreditEntryRepository,
  CreditHistoryRepository,
  OrderOutboxRepository
} from '@food-ordering-system/payment-application-service';

// Data Access
import {
  PaymentEntity,
  CreditEntryEntity,
  CreditHistoryEntity,
  OrderOutboxEntity,
  PaymentJpaRepository,
  CreditEntryJpaRepository,
  CreditHistoryJpaRepository,
  OrderOutboxJpaRepository,
  PaymentDataAccessMapper,
  CreditEntryDataAccessMapper,
  CreditHistoryDataAccessMapper,
  OrderOutboxDataAccessMapper,
  PaymentRepositoryImpl,
  CreditEntryRepositoryImpl,
  CreditHistoryRepositoryImpl,
  OrderOutboxRepositoryImpl
} from '@food-ordering-system/payment-dataaccess';

// Messaging
import {
  PaymentRequestKafkaListener,
  PaymentEventKafkaPublisher,
  PaymentMessagingDataMapper
} from '@food-ordering-system/payment-messaging';

import { KafkaProducer, KafkaMessageHelper } from '@food-ordering-system/common-kafka';

export class DependencyContainer {
  public static async setup(): Promise<void> {
    const config = ConfigLoader.getConfig();

    // Register configuration
    const paymentServiceConfig = new PaymentServiceConfigData(
      config.paymentService.paymentRequestTopicName,
      config.paymentService.paymentResponseTopicName,
      config.paymentService.outboxSchedulerFixedRate,
      config.paymentService.outboxSchedulerInitialDelay
    );
    container.registerInstance('PaymentServiceConfigData', paymentServiceConfig);

    // Setup DataSource
    const dataSource = new DataSource({
      type: 'postgres',
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.database,
      schema: config.database.schema,
      entities: [PaymentEntity, CreditEntryEntity, CreditHistoryEntity, OrderOutboxEntity],
      synchronize: false,
      logging: config.logging.level.root === 'DEBUG'
    });

    await dataSource.initialize();
    container.registerInstance(DataSource, dataSource);

    // Register repositories
    const paymentJpaRepository = dataSource.getRepository(PaymentEntity).extend(PaymentJpaRepository.prototype);
    const creditEntryJpaRepository = dataSource
      .getRepository(CreditEntryEntity)
      .extend(CreditEntryJpaRepository.prototype);
    const creditHistoryJpaRepository = dataSource
      .getRepository(CreditHistoryEntity)
      .extend(CreditHistoryJpaRepository.prototype);
    const orderOutboxJpaRepository = dataSource
      .getRepository(OrderOutboxEntity)
      .extend(OrderOutboxJpaRepository.prototype);

    // Register mappers
    const paymentDataAccessMapper = new PaymentDataAccessMapper();
    const creditEntryDataAccessMapper = new CreditEntryDataAccessMapper();
    const creditHistoryDataAccessMapper = new CreditHistoryDataAccessMapper();
    const orderOutboxDataAccessMapper = new OrderOutboxDataAccessMapper();

    // Register repository implementations
    const paymentRepository: PaymentRepository = new PaymentRepositoryImpl(
      paymentJpaRepository,
      paymentDataAccessMapper
    );
    const creditEntryRepository: CreditEntryRepository = new CreditEntryRepositoryImpl(
      creditEntryJpaRepository,
      creditEntryDataAccessMapper
    );
    const creditHistoryRepository: CreditHistoryRepository = new CreditHistoryRepositoryImpl(
      creditHistoryJpaRepository,
      creditHistoryDataAccessMapper
    );
    const orderOutboxRepository: OrderOutboxRepository = new OrderOutboxRepositoryImpl(
      orderOutboxJpaRepository,
      orderOutboxDataAccessMapper
    );

    container.registerInstance<PaymentRepository>('PaymentRepository', paymentRepository);
    container.registerInstance<CreditEntryRepository>('CreditEntryRepository', creditEntryRepository);
    container.registerInstance<CreditHistoryRepository>('CreditHistoryRepository', creditHistoryRepository);
    container.registerInstance<OrderOutboxRepository>('OrderOutboxRepository', orderOutboxRepository);

    // Register domain service
    const paymentDomainService: PaymentDomainService = new PaymentDomainServiceImpl();
    container.registerInstance<PaymentDomainService>('PaymentDomainService', paymentDomainService);

    // Register application service components
    const paymentDataMapper = new PaymentDataMapper();
    const orderOutboxHelper = new OrderOutboxHelper(orderOutboxRepository);

    // Setup Kafka
    const kafka = new Kafka({
      clientId: 'payment-service',
      brokers: config.kafkaConfig.bootstrapServers
    });

    const producer = kafka.producer();
    await producer.connect();

    const kafkaProducer = new KafkaProducer(producer);
    const kafkaMessageHelper = new KafkaMessageHelper();

    const paymentMessagingDataMapper = new PaymentMessagingDataMapper();

    const paymentResponseMessagePublisher: PaymentResponseMessagePublisher = new PaymentEventKafkaPublisher(
      paymentMessagingDataMapper,
      kafkaProducer,
      paymentServiceConfig,
      kafkaMessageHelper
    );

    const paymentRequestHelper = new PaymentRequestHelper(
      paymentDomainService,
      paymentDataMapper,
      paymentRepository,
      creditEntryRepository,
      creditHistoryRepository,
      orderOutboxHelper,
      paymentResponseMessagePublisher
    );

    const paymentRequestMessageListener: PaymentRequestMessageListener = new PaymentRequestMessageListenerImpl(
      paymentRequestHelper
    );

    const orderOutboxScheduler = new OrderOutboxScheduler(orderOutboxHelper, paymentResponseMessagePublisher);
    const orderOutboxCleanerScheduler = new OrderOutboxCleanerScheduler(orderOutboxHelper);

    container.registerInstance<PaymentRequestMessageListener>(
      'PaymentRequestMessageListener',
      paymentRequestMessageListener
    );
    container.registerInstance('OrderOutboxScheduler', orderOutboxScheduler);
    container.registerInstance('OrderOutboxCleanerScheduler', orderOutboxCleanerScheduler);

    // Setup Kafka consumer
    const consumer = kafka.consumer({
      groupId: config.kafkaConsumerConfig.paymentConsumerGroupId
    });

    await consumer.connect();
    await consumer.subscribe({
      topic: config.paymentService.paymentRequestTopicName,
      fromBeginning: config.kafkaConsumerConfig.autoOffsetReset === 'earliest'
    });

    const paymentRequestKafkaListener = new PaymentRequestKafkaListener(
      paymentRequestMessageListener,
      paymentMessagingDataMapper
    );

    await consumer.run({
      eachMessage: async payload => {
        await paymentRequestKafkaListener.consume(payload);
      }
    });

    container.registerInstance('KafkaConsumer', consumer);
  }
}
