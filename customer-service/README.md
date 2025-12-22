# Customer Service

A TypeScript-based microservice for managing customer data in the food ordering system. This service follows hexagonal (ports and adapters) architecture and clean architecture principles.

## Architecture

The service is organized into 6 main modules following Domain-Driven Design (DDD) and Clean Architecture:

### 1. customer-domain-core
**Purpose**: Contains core domain logic, entities, and domain events

**Files** (5):
- `CustomerDomainService.ts` - Domain service interface
- `CustomerDomainServiceImpl.ts` - Domain service implementation with business logic
- `entity/Customer.ts` - Customer aggregate root entity
- `event/CustomerCreatedEvent.ts` - Domain event for customer creation
- `exception/CustomerDomainException.ts` - Domain-specific exception

**Package**: `@food-ordering-system/customer-domain-core`

### 2. customer-application-service
**Purpose**: Application service layer with use cases, ports, and DTOs

**Files** (9):
- `CustomerApplicationServiceImpl.ts` - Main application service orchestrator
- `CustomerCreateCommandHandler.ts` - Command handler for customer creation
- `config/CustomerServiceConfigData.ts` - Service configuration
- `create/CreateCustomerCommand.ts` - DTO for create command
- `create/CreateCustomerResponse.ts` - DTO for create response
- `mapper/CustomerDataMapper.ts` - Maps between DTOs and domain entities
- `ports/input/service/CustomerApplicationService.ts` - Input port interface
- `ports/output/repository/CustomerRepository.ts` - Output port for repository
- `ports/output/message/publisher/CustomerMessagePublisher.ts` - Output port for messaging

**Package**: `@food-ordering-system/customer-application-service`

### 3. customer-dataaccess
**Purpose**: Data access layer with TypeORM integration

**Files** (5):
- `adapter/CustomerRepositoryImpl.ts` - Repository implementation (adapter)
- `entity/CustomerEntity.ts` - TypeORM database entity
- `exception/CustomerDataaccessException.ts` - Data access exception
- `mapper/CustomerDataAccessMapper.ts` - Maps between domain and database entities
- `repository/CustomerJpaRepository.ts` - TypeORM repository

**Package**: `@food-ordering-system/customer-dataaccess`

**Database**: PostgreSQL with schema `customer`
- Table: `customers` (id, username, first_name, last_name)
- Materialized view: `order_customer_m_view` (auto-refreshed on changes)

### 4. customer-application
**Purpose**: REST API layer with Express controllers

**Files** (2):
- `handler/CustomerGlobalExceptionHandler.ts` - Exception handler middleware
- `rest/CustomerController.ts` - REST controller for customer endpoints

**Package**: `@food-ordering-system/customer-application`

**Endpoints**:
- `POST /customers` - Create a new customer
- `GET /health` - Health check endpoint

### 5. customer-messaging
**Purpose**: Kafka messaging layer

**Files** (2):
- `mapper/CustomerMessagingDataMapper.ts` - Maps domain events to Avro models
- `publisher/kafka/CustomerCreatedEventKafkaPublisher.ts` - Kafka publisher for customer created events

**Package**: `@food-ordering-system/customer-messaging`

**Kafka Topic**: `customer` (configurable via application.yml)

### 6. customer-container
**Purpose**: Main application container with dependency injection

**Files** (4):
- `index.ts` - Main application entry point
- `config/BeanConfiguration.ts` - Dependency injection configuration
- `config/ConfigLoader.ts` - YAML configuration loader
- `db/DatabaseConfig.ts` - TypeORM database configuration

**Package**: `@food-ordering-system/customer-service`

## Configuration

The service is configured via `/customer-service/customer-container/src/main/resources/application.yml`:

```yaml
server:
  port: 8184

customer-service:
  customer-topic-name: customer

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/postgres?currentSchema=customer
    username: postgres
    password: admin

kafka-config:
  bootstrap-servers: localhost:19092, localhost:29092, localhost:39092
  schema-registry-url: http://localhost:8081
  num-of-partitions: 3
  replication-factor: 3

kafka-producer-config:
  key-serializer-class: org.apache.kafka.common.serialization.StringSerializer
  value-serializer-class: io.confluent.kafka.serializers.KafkaAvroSerializer
  compression-type: none
  acks: all
  batch-size: 16384
  linger-ms: 5
  request-timeout-ms: 60000
  retry-count: 5
```

## Building

### Install Dependencies

From the customer-service root directory:

```bash
# Install dependencies for all modules
cd customer-domain/customer-domain-core && npm install && cd ../..
cd customer-domain/customer-application-service && npm install && cd ../..
cd customer-dataaccess && npm install && cd ..
cd customer-application && npm install && cd ..
cd customer-messaging && npm install && cd ..
cd customer-container && npm install && cd ..
```

### Build All Modules

```bash
# Build domain core
cd customer-domain/customer-domain-core && npm run build && cd ../..

# Build application service
cd customer-domain/customer-application-service && npm run build && cd ../..

# Build data access
cd customer-dataaccess && npm run build && cd ..

# Build application (REST)
cd customer-application && npm run build && cd ..

# Build messaging
cd customer-messaging && npm run build && cd ..

# Build container (main app)
cd customer-container && npm run build && cd ..
```

## Running

### Prerequisites

1. **PostgreSQL** running on localhost:5432
   - Database: `postgres`
   - Schema: `customer` (created by init-schema.sql)

2. **Kafka cluster** running on:
   - localhost:19092
   - localhost:29092
   - localhost:39092

3. **Schema Registry** running on localhost:8081

### Database Setup

The database schema is automatically created from `customer-container/src/main/resources/init-schema.sql`:

```sql
-- Creates customer schema, tables, materialized views, and triggers
```

### Start the Service

```bash
cd customer-container

# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The service will start on port **8184**.

## Testing the API

### Create a Customer

```bash
curl -X POST http://localhost:8184/customers \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "123e4567-e89b-12d3-a456-426614174000",
    "username": "john_doe",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Response**:
```json
{
  "customerId": "123e4567-e89b-12d3-a456-426614174000",
  "message": "Customer saved successfully!"
}
```

### Health Check

```bash
curl http://localhost:8184/health
```

**Response**:
```json
{
  "status": "UP"
}
```

## Data Flow

1. **REST Request** → CustomerController
2. **Controller** → CustomerApplicationService (input port)
3. **Application Service** → CustomerCreateCommandHandler
4. **Command Handler**:
   - Maps DTO to domain entity (CustomerDataMapper)
   - Validates domain logic (CustomerDomainService)
   - Persists to database (CustomerRepository → CustomerRepositoryImpl)
   - Returns CustomerCreatedEvent
5. **Application Service** → CustomerMessagePublisher (publishes to Kafka)
6. **Response** → CreateCustomerResponse DTO

## Dependencies

### Common Modules
- `@food-ordering-system/common-domain` - Base domain classes (AggregateRoot, CustomerId, DomainEvent, etc.)
- `@food-ordering-system/common-application` - Common error handling and DTOs

### Infrastructure Modules
- `@food-ordering-system/kafka-producer` - Kafka producer implementation
- `@food-ordering-system/kafka-model` - Kafka Avro models
- `@food-ordering-system/kafka-config-data` - Kafka configuration

### External Libraries
- **express** - REST API framework
- **typeorm** - ORM for database access
- **pg** - PostgreSQL driver
- **kafkajs** - Kafka client
- **js-yaml** - YAML configuration parser
- **avsc** - Avro serialization

## Business Logic

### Customer Creation
1. Receives CreateCustomerCommand with customer details
2. Maps command to Customer domain entity
3. Validates and initiates customer (CustomerDomainService)
4. Persists customer to database (transactional)
5. Publishes CustomerCreatedEvent to Kafka topic
6. Returns success response

### Domain Rules
- All validation logic is in the domain layer
- Customer is an aggregate root with CustomerId value object
- CustomerCreatedEvent captures the creation timestamp
- Database operations are transactional

## Error Handling

### Domain Exceptions
- `CustomerDomainException` - Thrown when domain rules are violated
- Returns HTTP 400 (Bad Request)

### Data Access Exceptions
- `CustomerDataaccessException` - Thrown when database operations fail
- Returns HTTP 500 (Internal Server Error)

### Global Exception Handler
- Catches all unhandled exceptions
- Returns consistent error format (ErrorDTO)
- Logs errors for debugging

## Module Structure

```
customer-service/
├── customer-domain/
│   ├── customer-domain-core/
│   │   ├── src/
│   │   │   ├── entity/Customer.ts
│   │   │   ├── event/CustomerCreatedEvent.ts
│   │   │   ├── exception/CustomerDomainException.ts
│   │   │   ├── CustomerDomainService.ts
│   │   │   ├── CustomerDomainServiceImpl.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── customer-application-service/
│       ├── src/
│       │   ├── config/CustomerServiceConfigData.ts
│       │   ├── create/
│       │   ├── mapper/CustomerDataMapper.ts
│       │   ├── ports/
│       │   ├── CustomerApplicationServiceImpl.ts
│       │   ├── CustomerCreateCommandHandler.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── customer-dataaccess/
│   ├── src/
│   │   ├── adapter/CustomerRepositoryImpl.ts
│   │   ├── entity/CustomerEntity.ts
│   │   ├── exception/CustomerDataaccessException.ts
│   │   ├── mapper/CustomerDataAccessMapper.ts
│   │   ├── repository/CustomerJpaRepository.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── customer-application/
│   ├── src/
│   │   ├── handler/CustomerGlobalExceptionHandler.ts
│   │   ├── rest/CustomerController.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── customer-messaging/
│   ├── src/
│   │   ├── mapper/CustomerMessagingDataMapper.ts
│   │   ├── publisher/kafka/CustomerCreatedEventKafkaPublisher.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
└── customer-container/
    ├── src/
    │   ├── config/
    │   │   ├── BeanConfiguration.ts
    │   │   └── ConfigLoader.ts
    │   ├── db/DatabaseConfig.ts
    │   ├── main/resources/
    │   │   ├── application.yml
    │   │   └── init-schema.sql
    │   └── index.ts
    ├── package.json
    └── tsconfig.json
```

## Design Patterns

1. **Hexagonal Architecture (Ports and Adapters)**
   - Domain core is isolated from infrastructure
   - Input ports define use cases
   - Output ports define dependencies
   - Adapters implement infrastructure concerns

2. **Clean Architecture**
   - Dependencies point inward (domain is independent)
   - Domain layer has no external dependencies
   - Infrastructure depends on domain, not vice versa

3. **Domain-Driven Design (DDD)**
   - Customer is an aggregate root
   - Rich domain model with business logic
   - Domain events for cross-aggregate communication
   - Value objects (CustomerId) for type safety

4. **Dependency Injection**
   - BeanConfiguration manages all dependencies
   - Constructor injection for testability
   - Single responsibility principle

## Total Files Converted: 25

### Domain Core: 5 files
### Application Service: 9 files
### Data Access: 5 files
### REST Layer: 2 files
### Messaging: 2 files
### Container: 2 files (+ configuration files)

All business logic, validation rules, and architectural patterns from the Java implementation have been preserved in the TypeScript conversion.
