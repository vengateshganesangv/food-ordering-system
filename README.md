# Food Ordering System - Microservices with Node.js & TypeScript

A microservices-based food ordering system implementing **Clean Architecture**, **Domain-Driven Design (DDD)**, **SAGA Pattern**, **Outbox Pattern**, and **Event-Driven Architecture** using **Node.js**, **TypeScript**, **Kafka**, and **PostgreSQL**.

> **Note**: This project was migrated from Java/Spring Boot to Node.js/TypeScript while preserving all architectural patterns and functionalities.

> **Original Course**: [Microservices: Clean Architecture, DDD, SAGA, Outbox & Kafka](https://www.udemy.com/course/microservices-clean-architecture-ddd-saga-outbox-kafka-kubernetes/?referralCode=D9CF425EC696F08E501F)

## 🏗️ Architecture Overview

This system implements a sophisticated microservices architecture with the following patterns:

- **Clean Architecture / Hexagonal Architecture**: Separation of business logic from infrastructure
- **Domain-Driven Design (DDD)**: Aggregates, Entities, Value Objects, Domain Events
- **SAGA Pattern**: Distributed transaction management across microservices
- **Outbox Pattern**: Reliable message publishing with transactional guarantees
- **CQRS Elements**: Separation of command and query responsibilities
- **Event-Driven Architecture**: Asynchronous communication via Kafka

## 📦 Microservices

### 1. **Customer Service** (Port 8184)
- Manages customer profiles
- Publishes customer creation events
- **Status**: ✅ Fully Converted to TypeScript

### 2. **Order Service** (Port 8181)
- Orchestrates the order lifecycle
- Implements SAGA coordination for payments and approvals
- Manages order state transitions
- **Status**: 📦 Package structure created

### 3. **Payment Service** (Port 8182)
- Processes payments
- Manages customer credit
- Tracks payment history
- **Status**: 📦 Package structure created

### 4. **Restaurant Service** (Port 8183)
- Validates orders against restaurant inventory
- Approves or rejects orders
- **Status**: 📦 Package structure created

## 🛠️ Technology Stack

### Core Technologies
- **Node.js** v18+
- **TypeScript** v5.3+
- **Express.js** - REST API framework
- **TypeORM** - Database ORM (equivalent to Spring Data JPA)
- **PostgreSQL** - Relational database
- **KafkaJS** - Kafka client for Node.js

### Infrastructure
- **Kafka** - Message broker (3-broker cluster)
- **Zookeeper** - Kafka coordination
- **Schema Registry** - Avro schema management
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

### Development Tools
- **ts-node-dev** - Development server with hot reload
- **class-validator** - DTO validation
- **class-transformer** - Object transformation
- **dotenv** - Environment configuration
- **node-cron** - Scheduled tasks (Outbox polling)

## 📁 Project Structure

```
food-ordering-system/
├── common/
│   └── common-domain/              # DDD base classes, value objects
│       ├── entity/                 # BaseEntity, AggregateRoot
│       ├── valueobject/            # Money, IDs, Status enums
│       ├── event/                  # DomainEvent interface
│       └── exception/              # DomainException
│
├── infrastructure/
│   ├── kafka/
│   │   ├── kafka-config-data/      # Kafka configuration
│   │   ├── kafka-model/            # Avro models
│   │   ├── kafka-producer/         # Producer implementation
│   │   └── kafka-consumer/         # Consumer implementation
│   ├── saga/                       # SAGA pattern infrastructure
│   └── outbox/                     # Outbox pattern infrastructure
│
├── customer-service/               # ✅ FULLY IMPLEMENTED
│   ├── src/
│   │   ├── domain/
│   │   │   ├── core/              # Domain entities, services, events
│   │   │   └── application/        # Ports, DTOs, handlers
│   │   ├── dataaccess/            # Database entities, repositories
│   │   ├── messaging/             # Kafka publishers
│   │   ├── api/                   # REST controllers
│   │   └── config/                # Configuration, DI
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .env.example
│
├── order-service/                  # 📦 TO BE IMPLEMENTED
├── payment-service/                # 📦 TO BE IMPLEMENTED
├── restaurant-service/             # 📦 TO BE IMPLEMENTED
│
├── docker-compose.yml
├── package.json                    # Root workspace configuration
├── tsconfig.json                   # TypeScript configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **Docker** and **Docker Compose**
- **PostgreSQL** (if running locally without Docker)

### Installation

1. **Clone the repository**
```bash
cd food-ordering-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Build all packages**
```bash
npm run build
```

4. **Set up environment variables**

For Customer Service:
```bash
cd customer-service
cp .env.example .env
# Edit .env with your configuration
```

### Running with Docker Compose

The easiest way to run the entire system:

```bash
# Start all infrastructure and services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

This will start:
- PostgreSQL database with all schemas
- Kafka cluster (3 brokers)
- Zookeeper
- Schema Registry
- Customer Service

### Running Locally (Development)

1. **Start infrastructure only**
```bash
docker-compose up -d postgres kafka1 kafka2 kafka3 zookeeper schema-registry
```

2. **Initialize database**
```bash
psql -h localhost -U postgres -d postgres -f infrastructure/docker-compose/init-db.sql
```

3. **Run Customer Service**
```bash
cd customer-service
npm run dev
```

The service will start on `http://localhost:8184`

### Running Other Services

For Order, Payment, and Restaurant services (once implemented):

```bash
# Order Service
cd order-service && npm run dev

# Payment Service
cd payment-service && npm run dev

# Restaurant Service
cd restaurant-service && npm run dev
```

## 🔧 Configuration

### Environment Variables

Each service uses the following environment variables:

#### Customer Service (.env)
```env
PORT=8184
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_SCHEMA=customer
DB_USER=postgres
DB_PASSWORD=admin

# Kafka
KAFKA_BROKERS=localhost:19092,localhost:29092,localhost:39092
KAFKA_SCHEMA_REGISTRY_URL=http://localhost:8081
CUSTOMER_TOPIC_NAME=customer
```

#### Order Service
```env
PORT=8181
DB_SCHEMA=order
# ... similar configuration
```

## 📊 Database Schema

The system uses a **schema-per-service** pattern in PostgreSQL:

- `customer` schema - Customer Service
- `order` schema - Order Service
- `payment` schema - Payment Service
- `restaurant` schema - Restaurant Service

All schemas are automatically created by the `init-db.sql` script.

## 🔄 SAGA Flow Example: Order Creation

```
1. Client → POST /orders (Order Service)
2. Order Service creates Order (PENDING status)
3. Order Service saves Payment Outbox message
4. Outbox Scheduler publishes to "payment-request" topic
5. Payment Service receives message
6. Payment Service validates credit and processes payment
7. Payment Service publishes to "payment-response" topic
8. Order Service receives payment response
9. Order updates to PAID status
10. Order Service publishes to "restaurant-approval-request" topic
11. Restaurant Service validates order
12. Restaurant Service publishes to "restaurant-approval-response" topic
13. Order Service finalizes order (APPROVED or CANCELLED status)
```

## 🧪 API Documentation

### Customer Service

#### Create Customer
```http
POST /customers
Content-Type: application/json

{
  "customerId": "d215b5f8-0249-4dc5-89a3-51fd148cfb41",
  "username": "john_doe",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "customerId": "d215b5f8-0249-4dc5-89a3-51fd148cfb41",
  "message": "Customer saved successfully"
}
```

### Testing Customer Service

```bash
# Create a customer
curl -X POST http://localhost:8184/customers \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "550e8400-e29b-41d4-a716-446655440000",
    "username": "test_user",
    "firstName": "Test",
    "lastName": "User"
  }'

# Health check
curl http://localhost:8184/health
```

## 🏗️ Implementation Guide

### Customer Service ✅ Complete

The Customer Service is fully implemented and serves as a **reference implementation** for the other services. Review the following files to understand the architecture:

1. **Domain Core**:
   - `customer-service/src/domain/core/entity/Customer.ts`
   - `customer-service/src/domain/core/CustomerDomainService.ts`

2. **Application Layer**:
   - `customer-service/src/domain/application/handler/CustomerCreateCommandHandler.ts`
   - `customer-service/src/domain/application/ports/`

3. **Data Access**:
   - `customer-service/src/dataaccess/adapter/CustomerRepositoryImpl.ts`

4. **Messaging**:
   - `customer-service/src/messaging/publisher/CustomerCreatedEventKafkaPublisher.ts`

5. **Dependency Injection**:
   - `customer-service/src/config/DependencyInjection.ts`

### Implementing Remaining Services

To implement Order, Payment, and Restaurant services, follow the Customer Service structure:

1. Create domain entities based on Java originals
2. Implement TypeORM entities for database mapping
3. Set up SAGA steps (for Order Service)
4. Configure Outbox pattern for reliable messaging
5. Set up Kafka consumers for event handling

## 📚 Architecture Patterns

### Hexagonal Architecture (Ports & Adapters)

```
┌─────────────────────────────────────────┐
│         API Layer (Adapters)            │
│    REST Controllers, Route Handlers     │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│      Application Layer (Ports)          │
│  Application Services, Use Case Handlers│
│          DTOs, Mappers                   │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│          Domain Layer (Core)             │
│  Entities, Value Objects, Domain Services│
│     Domain Events, Business Rules        │
└─────────────────────────────────────────┘
                 │
     ┌───────────┴───────────┐
     │                       │
┌────▼─────────┐    ┌───────▼──────┐
│  Dataaccess  │    │  Messaging   │
│  (Adapters)  │    │  (Adapters)  │
│  TypeORM     │    │  Kafka       │
│  Repositories│    │  Pub/Sub     │
└──────────────┘    └──────────────┘
```

## 📝 Migration from Java

This project was migrated from a Java/Spring Boot implementation. Key conversions:

- **Spring Boot** → **Express.js**
- **Spring Data JPA** → **TypeORM**
- **Spring Kafka** → **KafkaJS**
- **Lombok** → **TypeScript classes**
- **@Bean/@Component** → **Dependency Injection pattern**
- **application.yml** → **.env files**
- **Maven** → **npm workspaces**

## ⚠️ Implementation Status

### ✅ Completed
- Project structure and monorepo setup
- Common domain modules (DDD base classes)
- Infrastructure modules (Kafka, SAGA, Outbox)
- **Customer Service** (fully functional)
- Database schemas for all services
- Docker Compose configuration
- Comprehensive documentation

### 📦 Pending Implementation
- **Order Service** - Core domain logic, SAGA orchestration, outbox schedulers
- **Payment Service** - Payment processing, credit management
- **Restaurant Service** - Order validation, approval logic

### 🎯 Next Steps

The **Customer Service** implementation serves as the complete reference for implementing the remaining services. Each service should follow the same hexagonal architecture pattern with clear separation between domain, application, data access, and messaging layers.

## 📄 License

Based on the Udemy course: "Microservices: Clean Architecture, DDD, SAGA, Outbox & Kafka"

## 🔗 References

- [Original Udemy Course](https://www.udemy.com/course/microservices-clean-architecture-ddd-saga-outbox-kafka-kubernetes/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [SAGA Pattern](https://microservices.io/patterns/data/saga.html)
- [Outbox Pattern](https://microservices.io/patterns/data/transactional-outbox.html)


