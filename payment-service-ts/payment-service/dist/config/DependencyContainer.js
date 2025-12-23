"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyContainer = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const kafkajs_1 = require("kafkajs");
const ConfigLoader_1 = require("./ConfigLoader");
const payment_application_service_1 = require("@food-ordering-system/payment-application-service");
// Domain
const payment_domain_core_1 = require("@food-ordering-system/payment-domain-core");
// Application Service
const payment_application_service_2 = require("@food-ordering-system/payment-application-service");
// Data Access
const payment_dataaccess_1 = require("@food-ordering-system/payment-dataaccess");
// Messaging
const payment_messaging_1 = require("@food-ordering-system/payment-messaging");
const kafka_producer_1 = require("@food-ordering-system/kafka-producer");
class DependencyContainer {
    static async setup() {
        const config = ConfigLoader_1.ConfigLoader.getConfig();
        // Register configuration
        const paymentServiceConfig = new payment_application_service_1.PaymentServiceConfigData(config.paymentService.paymentRequestTopicName, config.paymentService.paymentResponseTopicName, config.paymentService.outboxSchedulerFixedRate, config.paymentService.outboxSchedulerInitialDelay);
        // Setup DataSource
        const dataSource = new typeorm_1.DataSource({
            type: 'postgres',
            host: config.database.host,
            port: config.database.port,
            username: config.database.username,
            password: config.database.password,
            database: config.database.database,
            schema: config.database.schema,
            entities: [payment_dataaccess_1.PaymentEntity, payment_dataaccess_1.CreditEntryEntity, payment_dataaccess_1.CreditHistoryEntity, payment_dataaccess_1.OrderOutboxEntity],
            synchronize: false,
            logging: config.logging.level.root === 'DEBUG'
        });
        await dataSource.initialize();
        // Register repositories
        const paymentJpaRepository = dataSource.getRepository(payment_dataaccess_1.PaymentEntity).extend(payment_dataaccess_1.PaymentJpaRepository.prototype);
        const creditEntryJpaRepository = dataSource
            .getRepository(payment_dataaccess_1.CreditEntryEntity)
            .extend(payment_dataaccess_1.CreditEntryJpaRepository.prototype);
        const creditHistoryJpaRepository = dataSource
            .getRepository(payment_dataaccess_1.CreditHistoryEntity)
            .extend(payment_dataaccess_1.CreditHistoryJpaRepository.prototype);
        const orderOutboxJpaRepository = dataSource
            .getRepository(payment_dataaccess_1.OrderOutboxEntity)
            .extend(payment_dataaccess_1.OrderOutboxJpaRepository.prototype);
        // Register mappers
        const paymentDataAccessMapper = new payment_dataaccess_1.PaymentDataAccessMapper();
        const creditEntryDataAccessMapper = new payment_dataaccess_1.CreditEntryDataAccessMapper();
        const creditHistoryDataAccessMapper = new payment_dataaccess_1.CreditHistoryDataAccessMapper();
        const orderOutboxDataAccessMapper = new payment_dataaccess_1.OrderOutboxDataAccessMapper();
        // Register repository implementations
        const paymentRepository = new payment_dataaccess_1.PaymentRepositoryImpl(paymentJpaRepository, paymentDataAccessMapper);
        const creditEntryRepository = new payment_dataaccess_1.CreditEntryRepositoryImpl(creditEntryJpaRepository, creditEntryDataAccessMapper);
        const creditHistoryRepository = new payment_dataaccess_1.CreditHistoryRepositoryImpl(creditHistoryJpaRepository, creditHistoryDataAccessMapper);
        const orderOutboxRepository = new payment_dataaccess_1.OrderOutboxRepositoryImpl(orderOutboxJpaRepository, orderOutboxDataAccessMapper);
        // Register domain service
        const paymentDomainService = new payment_domain_core_1.PaymentDomainServiceImpl();
        // Register application service components
        const paymentDataMapper = new payment_application_service_2.PaymentDataMapper();
        const orderOutboxHelper = new payment_application_service_2.OrderOutboxHelper(orderOutboxRepository);
        // Setup Kafka
        const kafka = new kafkajs_1.Kafka({
            clientId: 'payment-service',
            brokers: config.kafkaConfig.bootstrapServers
        });
        const kafkaProducer = new kafka_producer_1.KafkaProducerImpl(kafka);
        const kafkaMessageHelper = new kafka_producer_1.KafkaMessageHelper();
        const paymentMessagingDataMapper = new payment_messaging_1.PaymentMessagingDataMapper();
        const paymentResponseMessagePublisher = new payment_messaging_1.PaymentEventKafkaPublisher(paymentMessagingDataMapper, kafkaProducer, paymentServiceConfig, kafkaMessageHelper);
        const paymentRequestHelper = new payment_application_service_2.PaymentRequestHelper(paymentDomainService, paymentDataMapper, paymentRepository, creditEntryRepository, creditHistoryRepository, orderOutboxHelper, paymentResponseMessagePublisher);
        const paymentRequestMessageListener = new payment_application_service_2.PaymentRequestMessageListenerImpl(paymentRequestHelper);
        // Store schedulers as class properties
        this.orderOutboxScheduler = new payment_application_service_2.OrderOutboxScheduler(orderOutboxHelper, paymentResponseMessagePublisher);
        this.orderOutboxCleanerScheduler = new payment_application_service_2.OrderOutboxCleanerScheduler(orderOutboxHelper);
        // Setup Kafka consumer
        const consumer = kafka.consumer({
            groupId: config.kafkaConsumerConfig.paymentConsumerGroupId
        });
        await consumer.connect();
        await consumer.subscribe({
            topic: config.paymentService.paymentRequestTopicName,
            fromBeginning: config.kafkaConsumerConfig.autoOffsetReset === 'earliest'
        });
        const paymentRequestKafkaListener = new payment_messaging_1.PaymentRequestKafkaListener(paymentRequestMessageListener, paymentMessagingDataMapper);
        await consumer.run({
            eachMessage: async (payload) => {
                await paymentRequestKafkaListener.consume(payload);
            }
        });
    }
    static getOrderOutboxScheduler() {
        return this.orderOutboxScheduler;
    }
    static getOrderOutboxCleanerScheduler() {
        return this.orderOutboxCleanerScheduler;
    }
}
exports.DependencyContainer = DependencyContainer;
