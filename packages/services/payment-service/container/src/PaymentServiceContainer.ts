import 'reflect-metadata';
import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { Kafka, Consumer, Producer } from 'kafkajs';

// Domain Core
import { PaymentDomainService, PaymentDomainServiceImpl } from '@food-ordering-system/payment-domain-core';

// Application Service
import {
  PaymentRequestMessageListener,
  PaymentRequestMessageListenerImpl,
  PaymentRequestHelper,
  PaymentDataMapper,
  OrderOutboxHelper,
  PaymentRepository,
  CreditEntryRepository,
  CreditHistoryRepository,
  OrderOutboxRepository,
  PaymentResponseMessagePublisher,
} from '@food-ordering-system/payment-application-service';

// Dataaccess
import {
  PaymentEntity,
  CreditEntryEntity,
  CreditHistoryEntity,
  OrderOutboxEntity,
  PaymentRepositoryImpl,
  CreditEntryRepositoryImpl,
  CreditHistoryRepositoryImpl,
  OrderOutboxRepositoryImpl,
} from '@food-ordering-system/payment-dataaccess';

// Messaging
import {
  PaymentMessagingDataMapper,
  PaymentRequestKafkaListener,
  PaymentEventKafkaPublisher,
} from '@food-ordering-system/payment-messaging';

export class PaymentServiceContainer {
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
      paymentRequestTopic: string;
      paymentResponseTopic: string;
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
      entities: [PaymentEntity, CreditEntryEntity, CreditHistoryEntity, OrderOutboxEntity],
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
    await this.startKafkaListener(config.topics.paymentRequestTopic, config.kafka.consumerGroupId);
  }

  private registerDependencies(config: {
    topics: {
      paymentRequestTopic: string;
      paymentResponseTopic: string;
    };
  }): void {
    // Register DataSource
    container.registerInstance(DataSource, this.dataSource);

    // Register Kafka
    container.registerInstance<Consumer>('KafkaConsumer', this.consumer);
    container.registerInstance<Producer>('KafkaProducer', this.producer);
    container.registerInstance<string>('PaymentResponseTopicName', config.topics.paymentResponseTopic);

    // Register Domain Service
    container.register<PaymentDomainService>('PaymentDomainService', {
      useClass: PaymentDomainServiceImpl,
    });

    // Register Repositories
    container.register<PaymentRepository>('PaymentRepository', {
      useClass: PaymentRepositoryImpl,
    });
    container.register<CreditEntryRepository>('CreditEntryRepository', {
      useClass: CreditEntryRepositoryImpl,
    });
    container.register<CreditHistoryRepository>('CreditHistoryRepository', {
      useClass: CreditHistoryRepositoryImpl,
    });
    container.register<OrderOutboxRepository>('OrderOutboxRepository', {
      useClass: OrderOutboxRepositoryImpl,
    });

    // Register Publisher
    container.register<PaymentResponseMessagePublisher>('PaymentResponseMessagePublisher', {
      useClass: PaymentEventKafkaPublisher,
    });

    // Register Application Service Components
    container.registerSingleton(PaymentDataMapper);
    container.registerSingleton(OrderOutboxHelper);
    container.registerSingleton(PaymentRequestHelper);

    // Register Listener
    container.register<PaymentRequestMessageListener>('PaymentRequestMessageListener', {
      useClass: PaymentRequestMessageListenerImpl,
    });

    // Register Messaging Components
    container.registerSingleton(PaymentMessagingDataMapper);
    container.registerSingleton(PaymentRequestKafkaListener);

    console.log('Dependencies registered');
  }

  private async startKafkaListener(topic: string, groupId: string): Promise<void> {
    const listener = container.resolve(PaymentRequestKafkaListener);
    await listener.listen(topic, groupId);
  }

  async shutdown(): Promise<void> {
    await this.consumer.disconnect();
    await this.producer.disconnect();
    await this.dataSource.destroy();
    console.log('Payment Service shutdown complete');
  }
}
