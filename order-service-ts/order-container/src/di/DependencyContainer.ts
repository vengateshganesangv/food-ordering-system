import { DataSource, Repository } from 'typeorm';
import * as cron from 'node-cron';

// Domain
import { OrderDomainService, OrderDomainServiceImpl } from '@food-ordering-system/order-domain-core';

// Application Service
import {
  OrderApplicationService,
  OrderApplicationServiceImpl,
  OrderCreateCommandHandler,
  OrderTrackCommandHandler,
  OrderCreateHelper,
  OrderDataMapper,
  OrderSagaHelper,
  OrderPaymentSaga,
  OrderApprovalSaga,
  PaymentOutboxHelper,
  ApprovalOutboxHelper,
  PaymentOutboxScheduler,
  PaymentOutboxCleanerScheduler,
  RestaurantApprovalOutboxScheduler,
  RestaurantApprovalOutboxCleanerScheduler,
  PaymentResponseMessageListenerImpl,
  RestaurantApprovalResponseMessageListenerImpl,
  CustomerMessageListenerImpl,
  OrderServiceConfigData,
} from '@food-ordering-system/order-application-service';

// Dataaccess
import {
  OrderEntity,
  OrderItemEntity,
  OrderAddressEntity,
  CustomerEntity,
  PaymentOutboxEntity,
  ApprovalOutboxEntity,
  OrderJpaRepository,
  OrderDataAccessMapper,
  OrderRepositoryImpl,
  CustomerJpaRepository,
  CustomerDataAccessMapper,
  CustomerRepositoryImpl,
  RestaurantDataAccessMapper,
  RestaurantRepositoryImpl,
  PaymentOutboxJpaRepository,
  PaymentOutboxDataAccessMapper,
  PaymentOutboxRepositoryImpl,
  ApprovalOutboxJpaRepository,
  ApprovalOutboxDataAccessMapper,
  ApprovalOutboxRepositoryImpl,
} from '@food-ordering-system/order-dataaccess';

// Messaging
import {
  OrderMessagingDataMapper,
  OrderPaymentEventKafkaPublisher,
  OrderApprovalEventKafkaPublisher,
  CustomerKafkaListener,
  PaymentResponseKafkaListener,
  RestaurantApprovalResponseKafkaListener,
} from '@food-ordering-system/order-messaging';

// Kafka
import { KafkaProducer, KafkaMessageHelper } from '@food-ordering-system/kafka-producer';
import { KafkaConsumerManager } from '@food-ordering-system/kafka-consumer';

import { AppConfig } from '../config/ConfigLoader';
import { Logger } from '@food-ordering-system/common-domain';

export class DependencyContainer {
  private static readonly logger = new Logger('DependencyContainer');

  // Domain Services
  public orderDomainService: OrderDomainService;

  // Application Services
  public orderApplicationService: OrderApplicationService;
  public orderCreateCommandHandler: OrderCreateCommandHandler;
  public orderTrackCommandHandler: OrderTrackCommandHandler;
  public paymentResponseMessageListener: PaymentResponseMessageListenerImpl;
  public restaurantApprovalResponseMessageListener: RestaurantApprovalResponseMessageListenerImpl;
  public customerMessageListener: CustomerMessageListenerImpl;

  // Repositories
  public orderRepository: OrderRepositoryImpl;
  public customerRepository: CustomerRepositoryImpl;
  public restaurantRepository: RestaurantRepositoryImpl;
  public paymentOutboxRepository: PaymentOutboxRepositoryImpl;
  public approvalOutboxRepository: ApprovalOutboxRepositoryImpl;

  // Messaging
  public orderPaymentEventKafkaPublisher: OrderPaymentEventKafkaPublisher;
  public orderApprovalEventKafkaPublisher: OrderApprovalEventKafkaPublisher;
  public customerKafkaListener: CustomerKafkaListener;
  public paymentResponseKafkaListener: PaymentResponseKafkaListener;
  public restaurantApprovalResponseKafkaListener: RestaurantApprovalResponseKafkaListener;

  // Kafka
  public kafkaProducer: KafkaProducer<string, any>;
  public kafkaConsumerManager: KafkaConsumerManager;

  // Schedulers
  private paymentOutboxScheduler?: PaymentOutboxScheduler;
  private paymentOutboxCleanerScheduler?: PaymentOutboxCleanerScheduler;
  private restaurantApprovalOutboxScheduler?: RestaurantApprovalOutboxScheduler;
  private restaurantApprovalOutboxCleanerScheduler?: RestaurantApprovalOutboxCleanerScheduler;

  // Cron jobs
  private cronJobs: cron.ScheduledTask[] = [];

  constructor(
    private dataSource: DataSource,
    private config: AppConfig,
  ) {
    // Initialize Domain Services
    this.orderDomainService = new OrderDomainServiceImpl();

    // Initialize Repositories
    this.orderRepository = this.createOrderRepository();
    this.customerRepository = this.createCustomerRepository();
    this.restaurantRepository = this.createRestaurantRepository();
    this.paymentOutboxRepository = this.createPaymentOutboxRepository();
    this.approvalOutboxRepository = this.createApprovalOutboxRepository();

    // Initialize Kafka
    this.kafkaProducer = this.createKafkaProducer();
    this.kafkaConsumerManager = this.createKafkaConsumerManager();

    // Initialize Messaging Publishers
    this.orderPaymentEventKafkaPublisher = this.createOrderPaymentEventKafkaPublisher();
    this.orderApprovalEventKafkaPublisher = this.createOrderApprovalEventKafkaPublisher();

    // Initialize Application Services and Handlers
    const { orderApplicationService, orderCreateCommandHandler, orderTrackCommandHandler } =
      this.createApplicationServices();
    this.orderApplicationService = orderApplicationService;
    this.orderCreateCommandHandler = orderCreateCommandHandler;
    this.orderTrackCommandHandler = orderTrackCommandHandler;

    // Initialize Message Listeners
    this.paymentResponseMessageListener = this.createPaymentResponseMessageListener();
    this.restaurantApprovalResponseMessageListener = this.createRestaurantApprovalResponseMessageListener();
    this.customerMessageListener = this.createCustomerMessageListener();

    // Initialize Kafka Listeners
    this.customerKafkaListener = this.createCustomerKafkaListener();
    this.paymentResponseKafkaListener = this.createPaymentResponseKafkaListener();
    this.restaurantApprovalResponseKafkaListener = this.createRestaurantApprovalResponseKafkaListener();

    // Initialize Schedulers
    this.initializeSchedulers();
  }

  private createOrderRepository(): OrderRepositoryImpl {
    const orderRepo = this.dataSource.getRepository(OrderEntity);
    const orderJpaRepository = new OrderJpaRepository(orderRepo);
    const orderDataAccessMapper = new OrderDataAccessMapper();
    return new OrderRepositoryImpl(orderJpaRepository, orderDataAccessMapper);
  }

  private createCustomerRepository(): CustomerRepositoryImpl {
    const customerRepo = this.dataSource.getRepository(CustomerEntity);
    const customerJpaRepository = new CustomerJpaRepository(customerRepo);
    const customerDataAccessMapper = new CustomerDataAccessMapper();
    return new CustomerRepositoryImpl(customerJpaRepository, customerDataAccessMapper);
  }

  private createRestaurantRepository(): RestaurantRepositoryImpl {
    const restaurantDataAccessMapper = new RestaurantDataAccessMapper();
    return new RestaurantRepositoryImpl(
      this.dataSource.getRepository(OrderEntity),
      restaurantDataAccessMapper,
    );
  }

  private createPaymentOutboxRepository(): PaymentOutboxRepositoryImpl {
    const paymentOutboxRepo = this.dataSource.getRepository(PaymentOutboxEntity);
    const paymentOutboxJpaRepository = new PaymentOutboxJpaRepository(paymentOutboxRepo);
    const paymentOutboxDataAccessMapper = new PaymentOutboxDataAccessMapper();
    return new PaymentOutboxRepositoryImpl(paymentOutboxJpaRepository, paymentOutboxDataAccessMapper);
  }

  private createApprovalOutboxRepository(): ApprovalOutboxRepositoryImpl {
    const approvalOutboxRepo = this.dataSource.getRepository(ApprovalOutboxEntity);
    const approvalOutboxJpaRepository = new ApprovalOutboxJpaRepository(approvalOutboxRepo);
    const approvalOutboxDataAccessMapper = new ApprovalOutboxDataAccessMapper();
    return new ApprovalOutboxRepositoryImpl(approvalOutboxJpaRepository, approvalOutboxDataAccessMapper);
  }

  private createKafkaProducer(): KafkaProducer<string, any> {
    return new KafkaProducer(
      this.config.kafka.bootstrapServers,
      this.config.kafkaProducer.acks as any,
      this.config.kafkaProducer.compressionType as any,
    );
  }

  private createKafkaConsumerManager(): KafkaConsumerManager {
    return new KafkaConsumerManager(
      this.config.kafka.bootstrapServers,
      this.config.kafkaConsumer.autoOffsetReset as any,
    );
  }

  private createOrderPaymentEventKafkaPublisher(): OrderPaymentEventKafkaPublisher {
    const orderMessagingDataMapper = new OrderMessagingDataMapper();
    const kafkaMessageHelper = new KafkaMessageHelper();
    const orderServiceConfigData = this.createOrderServiceConfigData();

    return new OrderPaymentEventKafkaPublisher(
      orderMessagingDataMapper,
      this.kafkaProducer,
      orderServiceConfigData,
      kafkaMessageHelper,
    );
  }

  private createOrderApprovalEventKafkaPublisher(): OrderApprovalEventKafkaPublisher {
    const orderMessagingDataMapper = new OrderMessagingDataMapper();
    const kafkaMessageHelper = new KafkaMessageHelper();
    const orderServiceConfigData = this.createOrderServiceConfigData();

    return new OrderApprovalEventKafkaPublisher(
      orderMessagingDataMapper,
      this.kafkaProducer,
      orderServiceConfigData,
      kafkaMessageHelper,
    );
  }

  private createOrderServiceConfigData(): OrderServiceConfigData {
    return {
      getPaymentRequestTopicName: () => this.config.orderService.paymentRequestTopicName,
      getPaymentResponseTopicName: () => this.config.orderService.paymentResponseTopicName,
      getRestaurantApprovalRequestTopicName: () => this.config.orderService.restaurantApprovalRequestTopicName,
      getRestaurantApprovalResponseTopicName: () => this.config.orderService.restaurantApprovalResponseTopicName,
      getOutboxSchedulerFixedRate: () => this.config.orderService.outboxSchedulerFixedRate,
      getOutboxSchedulerInitialDelay: () => this.config.orderService.outboxSchedulerInitialDelay,
    } as OrderServiceConfigData;
  }

  private createApplicationServices() {
    const orderDataMapper = new OrderDataMapper();
    const orderCreateHelper = new OrderCreateHelper(
      this.orderDomainService,
      this.orderRepository,
      this.customerRepository,
      this.restaurantRepository,
      orderDataMapper,
    );

    const orderSagaHelper = new OrderSagaHelper();

    const paymentOutboxHelper = new PaymentOutboxHelper(
      this.paymentOutboxRepository,
      orderDataMapper,
      orderSagaHelper,
    );

    const approvalOutboxHelper = new ApprovalOutboxHelper(
      this.approvalOutboxRepository,
      orderDataMapper,
      orderSagaHelper,
    );

    const orderPaymentSaga = new OrderPaymentSaga(
      this.orderDomainService,
      this.orderRepository,
      paymentOutboxHelper,
      approvalOutboxHelper,
      orderSagaHelper,
      orderDataMapper,
    );

    const orderApprovalSaga = new OrderApprovalSaga(
      this.orderDomainService,
      this.orderRepository,
      approvalOutboxHelper,
      orderSagaHelper,
      orderDataMapper,
    );

    const orderCreateCommandHandler = new OrderCreateCommandHandler(orderCreateHelper, paymentOutboxHelper);

    const orderTrackCommandHandler = new OrderTrackCommandHandler(this.orderRepository, orderDataMapper);

    const paymentResponseMessageListener = new PaymentResponseMessageListenerImpl(orderPaymentSaga);

    const restaurantApprovalResponseMessageListener = new RestaurantApprovalResponseMessageListenerImpl(
      orderApprovalSaga,
    );

    const customerMessageListener = new CustomerMessageListenerImpl(this.customerRepository);

    const orderApplicationService = new OrderApplicationServiceImpl(
      orderCreateCommandHandler,
      orderTrackCommandHandler,
    );

    // Store schedulers for initialization
    this.paymentOutboxScheduler = new PaymentOutboxScheduler(
      paymentOutboxHelper,
      this.orderPaymentEventKafkaPublisher,
    );

    this.paymentOutboxCleanerScheduler = new PaymentOutboxCleanerScheduler(
      this.paymentOutboxRepository,
      paymentOutboxHelper,
    );

    this.restaurantApprovalOutboxScheduler = new RestaurantApprovalOutboxScheduler(
      approvalOutboxHelper,
      this.orderApprovalEventKafkaPublisher,
    );

    this.restaurantApprovalOutboxCleanerScheduler = new RestaurantApprovalOutboxCleanerScheduler(
      this.approvalOutboxRepository,
      approvalOutboxHelper,
    );

    return {
      orderApplicationService,
      orderCreateCommandHandler,
      orderTrackCommandHandler,
    };
  }

  private createPaymentResponseMessageListener(): PaymentResponseMessageListenerImpl {
    const orderSagaHelper = new OrderSagaHelper();
    const orderDataMapper = new OrderDataMapper();
    const paymentOutboxHelper = new PaymentOutboxHelper(
      this.paymentOutboxRepository,
      orderDataMapper,
      orderSagaHelper,
    );
    const approvalOutboxHelper = new ApprovalOutboxHelper(
      this.approvalOutboxRepository,
      orderDataMapper,
      orderSagaHelper,
    );

    const orderPaymentSaga = new OrderPaymentSaga(
      this.orderDomainService,
      this.orderRepository,
      paymentOutboxHelper,
      approvalOutboxHelper,
      orderSagaHelper,
      orderDataMapper,
    );

    return new PaymentResponseMessageListenerImpl(orderPaymentSaga);
  }

  private createRestaurantApprovalResponseMessageListener(): RestaurantApprovalResponseMessageListenerImpl {
    const orderSagaHelper = new OrderSagaHelper();
    const orderDataMapper = new OrderDataMapper();
    const approvalOutboxHelper = new ApprovalOutboxHelper(
      this.approvalOutboxRepository,
      orderDataMapper,
      orderSagaHelper,
    );

    const orderApprovalSaga = new OrderApprovalSaga(
      this.orderDomainService,
      this.orderRepository,
      approvalOutboxHelper,
      orderSagaHelper,
      orderDataMapper,
    );

    return new RestaurantApprovalResponseMessageListenerImpl(orderApprovalSaga);
  }

  private createCustomerMessageListener(): CustomerMessageListenerImpl {
    return new CustomerMessageListenerImpl(this.customerRepository);
  }

  private createCustomerKafkaListener(): CustomerKafkaListener {
    const orderMessagingDataMapper = new OrderMessagingDataMapper();
    return new CustomerKafkaListener(this.customerMessageListener, orderMessagingDataMapper);
  }

  private createPaymentResponseKafkaListener(): PaymentResponseKafkaListener {
    const orderMessagingDataMapper = new OrderMessagingDataMapper();
    return new PaymentResponseKafkaListener(this.paymentResponseMessageListener, orderMessagingDataMapper);
  }

  private createRestaurantApprovalResponseKafkaListener(): RestaurantApprovalResponseKafkaListener {
    const orderMessagingDataMapper = new OrderMessagingDataMapper();
    return new RestaurantApprovalResponseKafkaListener(
      this.restaurantApprovalResponseMessageListener,
      orderMessagingDataMapper,
    );
  }

  private initializeSchedulers(): void {
    const fixedRate = this.config.orderService.outboxSchedulerFixedRate;
    const cronExpression = `*/${Math.floor(fixedRate / 1000)} * * * * *`; // Convert ms to seconds for cron

    // Payment Outbox Scheduler
    if (this.paymentOutboxScheduler) {
      const paymentSchedulerJob = cron.schedule(cronExpression, async () => {
        await this.paymentOutboxScheduler!.processOutboxMessage();
      });
      this.cronJobs.push(paymentSchedulerJob);
      DependencyContainer.logger.info('Payment Outbox Scheduler initialized');
    }

    // Payment Outbox Cleaner Scheduler
    if (this.paymentOutboxCleanerScheduler) {
      const paymentCleanerJob = cron.schedule(cronExpression, async () => {
        await this.paymentOutboxCleanerScheduler!.processOutboxMessage();
      });
      this.cronJobs.push(paymentCleanerJob);
      DependencyContainer.logger.info('Payment Outbox Cleaner Scheduler initialized');
    }

    // Restaurant Approval Outbox Scheduler
    if (this.restaurantApprovalOutboxScheduler) {
      const approvalSchedulerJob = cron.schedule(cronExpression, async () => {
        await this.restaurantApprovalOutboxScheduler!.processOutboxMessage();
      });
      this.cronJobs.push(approvalSchedulerJob);
      DependencyContainer.logger.info('Restaurant Approval Outbox Scheduler initialized');
    }

    // Restaurant Approval Outbox Cleaner Scheduler
    if (this.restaurantApprovalOutboxCleanerScheduler) {
      const approvalCleanerJob = cron.schedule(cronExpression, async () => {
        await this.restaurantApprovalOutboxCleanerScheduler!.processOutboxMessage();
      });
      this.cronJobs.push(approvalCleanerJob);
      DependencyContainer.logger.info('Restaurant Approval Outbox Cleaner Scheduler initialized');
    }
  }

  public async startKafkaConsumers(): Promise<void> {
    await this.kafkaConsumerManager.subscribe(this.customerKafkaListener);
    await this.kafkaConsumerManager.subscribe(this.paymentResponseKafkaListener);
    await this.kafkaConsumerManager.subscribe(this.restaurantApprovalResponseKafkaListener);
    DependencyContainer.logger.info('Kafka consumers started');
  }

  public async shutdown(): Promise<void> {
    DependencyContainer.logger.info('Shutting down dependency container...');

    // Stop cron jobs
    this.cronJobs.forEach((job) => job.stop());

    // Disconnect Kafka
    await this.kafkaProducer.disconnect();
    await this.kafkaConsumerManager.disconnect();

    // Close database connection
    await this.dataSource.destroy();

    DependencyContainer.logger.info('Dependency container shut down successfully');
  }
}
