import { DataSource } from 'typeorm';
import { Kafka } from 'kafkajs';
import { CustomerDomainService, CustomerDomainServiceImpl } from '@food-ordering-system/customer-domain-core';
import {
  CustomerApplicationService,
  CustomerApplicationServiceImpl,
  CustomerCreateCommandHandler,
  CustomerDataMapper,
  CustomerRepository,
  CustomerMessagePublisher,
  CustomerServiceConfigData,
} from '@food-ordering-system/customer-application-service';
import {
  CustomerRepositoryImpl,
  CustomerDataAccessMapper,
  CustomerJpaRepository,
  createCustomerJpaRepository,
} from '@food-ordering-system/customer-dataaccess';
import {
  CustomerMessagingDataMapper,
  CustomerCreatedEventKafkaPublisher,
} from '@food-ordering-system/customer-messaging';
import { KafkaProducerImpl, KafkaProducerConfig } from '@food-ordering-system/kafka-producer';
import { CustomerAvroModel, CustomerAvroModelSchema, AvroSerializerFactory } from '@food-ordering-system/kafka-model';
import { AppConfig } from './ConfigLoader';

/**
 * Bean Configuration
 * Manages dependency injection and bean creation for the customer service
 */
export class BeanConfiguration {
  private readonly config: AppConfig;
  private readonly dataSource: DataSource;

  // Domain beans
  private customerDomainService: CustomerDomainService | null = null;

  // Application service beans
  private customerDataMapper: CustomerDataMapper | null = null;
  private customerServiceConfigData: CustomerServiceConfigData | null = null;
  private customerCreateCommandHandler: CustomerCreateCommandHandler | null = null;
  private customerApplicationService: CustomerApplicationService | null = null;

  // Data access beans
  private customerDataAccessMapper: CustomerDataAccessMapper | null = null;
  private customerJpaRepository: CustomerJpaRepository | null = null;
  private customerRepository: CustomerRepository | null = null;

  // Messaging beans
  private customerMessagingDataMapper: CustomerMessagingDataMapper | null = null;
  private customerMessagePublisher: CustomerMessagePublisher | null = null;

  constructor(config: AppConfig, dataSource: DataSource) {
    this.config = config;
    this.dataSource = dataSource;
  }

  /**
   * Get or create CustomerDomainService bean
   */
  getCustomerDomainService(): CustomerDomainService {
    if (!this.customerDomainService) {
      this.customerDomainService = new CustomerDomainServiceImpl();
    }
    return this.customerDomainService;
  }

  /**
   * Get or create CustomerDataMapper bean
   */
  getCustomerDataMapper(): CustomerDataMapper {
    if (!this.customerDataMapper) {
      this.customerDataMapper = new CustomerDataMapper();
    }
    return this.customerDataMapper;
  }

  /**
   * Get or create CustomerServiceConfigData bean
   */
  getCustomerServiceConfigData(): CustomerServiceConfigData {
    if (!this.customerServiceConfigData) {
      this.customerServiceConfigData = new CustomerServiceConfigData(
        this.config.customerService.customerTopicName
      );
    }
    return this.customerServiceConfigData;
  }

  /**
   * Get or create CustomerDataAccessMapper bean
   */
  getCustomerDataAccessMapper(): CustomerDataAccessMapper {
    if (!this.customerDataAccessMapper) {
      this.customerDataAccessMapper = new CustomerDataAccessMapper();
    }
    return this.customerDataAccessMapper;
  }

  /**
   * Get or create CustomerJpaRepository bean
   */
  getCustomerJpaRepository(): CustomerJpaRepository {
    if (!this.customerJpaRepository) {
      this.customerJpaRepository = createCustomerJpaRepository(this.dataSource);
    }
    return this.customerJpaRepository;
  }

  /**
   * Get or create CustomerRepository bean
   */
  getCustomerRepository(): CustomerRepository {
    if (!this.customerRepository) {
      this.customerRepository = new CustomerRepositoryImpl(
        this.getCustomerJpaRepository(),
        this.getCustomerDataAccessMapper()
      );
    }
    return this.customerRepository;
  }

  /**
   * Get or create CustomerMessagingDataMapper bean
   */
  getCustomerMessagingDataMapper(): CustomerMessagingDataMapper {
    if (!this.customerMessagingDataMapper) {
      this.customerMessagingDataMapper = new CustomerMessagingDataMapper();
    }
    return this.customerMessagingDataMapper;
  }

  /**
   * Get or create CustomerMessagePublisher bean
   */
  getCustomerMessagePublisher(): CustomerMessagePublisher {
    if (!this.customerMessagePublisher) {
      // Create Kafka client
      const kafka = new Kafka({
        clientId: 'customer-service',
        brokers: this.config.kafkaConfig.bootstrapServers.split(',').map(s => s.trim()),
      });

      // Create Avro serializer
      const avroSerializer = AvroSerializerFactory.createSerializer(CustomerAvroModelSchema);

      // Create Kafka producer config
      const kafkaProducerConfig = new KafkaProducerConfig(kafka, avroSerializer);

      // Create Kafka producer
      const kafkaProducer = new KafkaProducerImpl<string, CustomerAvroModel>(kafkaProducerConfig);

      // Create publisher
      this.customerMessagePublisher = new CustomerCreatedEventKafkaPublisher(
        this.getCustomerMessagingDataMapper(),
        kafkaProducer,
        this.getCustomerServiceConfigData()
      );
    }
    return this.customerMessagePublisher;
  }

  /**
   * Get or create CustomerCreateCommandHandler bean
   */
  getCustomerCreateCommandHandler(): CustomerCreateCommandHandler {
    if (!this.customerCreateCommandHandler) {
      this.customerCreateCommandHandler = new CustomerCreateCommandHandler(
        this.getCustomerDomainService(),
        this.getCustomerRepository(),
        this.getCustomerDataMapper()
      );
    }
    return this.customerCreateCommandHandler;
  }

  /**
   * Get or create CustomerApplicationService bean
   */
  getCustomerApplicationService(): CustomerApplicationService {
    if (!this.customerApplicationService) {
      this.customerApplicationService = new CustomerApplicationServiceImpl(
        this.getCustomerCreateCommandHandler(),
        this.getCustomerDataMapper(),
        this.getCustomerMessagePublisher()
      );
    }
    return this.customerApplicationService;
  }
}
