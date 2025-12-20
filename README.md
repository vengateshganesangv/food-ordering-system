# Food Ordering System - Node.js/TypeScript

A microservices-based food ordering system implementing Clean Architecture, DDD, SAGA, Outbox, and CQRS patterns.

**Converted from Java/Spring Boot to Node.js/TypeScript**

Original course: [Microservices: Clean Architecture, DDD, SAGA, Outbox & Kafka](https://www.udemy.com/course/microservices-clean-architecture-ddd-saga-outbox-kafka-kubernetes/?referralCode=D9CF425EC696F08E501F)

## Architecture Overview

This system implements:
- **Clean/Hexagonal Architecture** - Clear separation of domain, application, and infrastructure layers
- **Domain-Driven Design (DDD)** - Aggregates, entities, value objects, and domain services
- **SAGA Pattern** - Distributed transaction orchestration across microservices
- **Outbox Pattern** - Reliable messaging with at-least-once delivery guarantees
- **CQRS** - Command/Query separation
- **Event-Driven Architecture** - Kafka-based asynchronous communication

## Project Structure

```
food-ordering-system/
├── packages/
│   ├── common/                    # Shared modules
│   │   ├── common-domain/         # Domain primitives (BaseEntity, Money, etc.)
│   │   ├── common-application/    # Application utilities
│   │   └── common-dataaccess/     # Data access utilities
│   ├── infrastructure/            # Infrastructure modules
│   │   ├── saga/                  # SAGA pattern implementation
│   │   ├── outbox/                # Outbox pattern implementation
│   │   ├── kafka-producer/        # Kafka producer wrapper
│   │   ├── kafka-consumer/        # Kafka consumer wrapper
│   │   └── kafka-config-data/     # Kafka configuration
│   └── services/                  # Microservices
│       ├── order-service/         # Order management service
│       ├── payment-service/       # Payment processing service
│       ├── restaurant-service/    # Restaurant approval service
│       └── customer-service/      # Customer management service
├── database-migrations/           # PostgreSQL schema migrations
├── docker-compose.yml            # Local development environment
└── package.json                  # Root workspace configuration
```

## Technology Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript 5.3+
- **Web Framework**: Express.js
- **ORM**: TypeORM
- **Database**: PostgreSQL 15
- **Message Broker**: Apache Kafka (KafkaJS client)
- **Dependency Injection**: tsyringe / inversify
- **Validation**: class-validator
- **Testing**: Jest (to be added)

## Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- Docker and Docker Compose
- PostgreSQL 15 (via Docker)
- Apache Kafka (via Docker)

## Getting Started

### 1. Install Dependencies

```bash
# Install all workspace dependencies
npm install
```

### 2. Start Infrastructure Services

```bash
# Start PostgreSQL, Kafka, Zookeeper, and Schema Registry
docker-compose up -d

# Verify services are running
docker-compose ps
```

### 3. Build All Packages

```bash
# Build all TypeScript packages
npm run build
```

## Service Details

### Order Service
- **Responsibilities**:
  - Create and track orders
  - Orchestrate SAGA workflows (payment → approval)
  - Manage order lifecycle
- **Endpoints**:
  - `POST /api/v1/orders` - Create order
  - `GET /api/v1/orders/:trackingId` - Track order

### Payment Service
- **Responsibilities**:
  - Process payments
  - Manage customer credit
  - Publish payment events

### Restaurant Service
- **Responsibilities**:
  - Approve/reject orders
  - Validate product availability
  - Publish approval events

### Customer Service
- **Responsibilities**:
  - Manage customer data
  - Publish customer events

## Database Schema

The system uses PostgreSQL with separate schemas for each service:
- `order` - Order service tables
- `payment` - Payment service tables
- `restaurant` - Restaurant service tables
- `customer` - Customer service tables

Initialize via Docker Compose (automatic) or manually:
```bash
psql -U postgres -d food_ordering -f database-migrations/init-schema.sql
```

## Kafka Topics

- `payment-request` - Payment requests from order service
- `payment-response` - Payment responses to order service
- `restaurant-approval-request` - Approval requests to restaurant service
- `restaurant-approval-response` - Approval responses to order service
- `customer` - Customer creation events

## Key Patterns Implementation

### Hexagonal Architecture

Each service follows hexagonal architecture:

```
service/
├── domain-core/              # Domain logic (no dependencies)
├── application-service/      # Use cases and ports
│   ├── ports/
│   │   ├── input/           # Driving adapters
│   │   └── output/          # Driven adapters
│   ├── dto/                 # Data transfer objects
│   └── mapper/              # Domain ↔ DTO mapping
├── dataaccess/              # Database adapters
├── messaging/               # Kafka adapters
├── application/             # REST API
└── container/               # DI configuration
```

### SAGA Pattern

Orchestration-based SAGA for distributed transactions:

1. **Order Created** → Publish payment request
2. **Payment Completed** → Publish approval request
3. **Approval Confirmed** → Order approved
4. **Failure** → Compensating transactions

### Outbox Pattern

Ensures reliable message delivery:

1. Save domain changes + outbox message in same transaction
2. Background scheduler polls outbox table
3. Publish messages to Kafka
4. Mark as completed
5. Cleanup completed messages

## Status

### ✅ Completed
- Project structure and monorepo setup
- Common domain modules
- Infrastructure modules (SAGA, Outbox, Kafka)
- Order service (complete)
- Customer service (complete)
- Payment & Restaurant services (domain core)
- Database migrations
- Docker Compose setup

### 🚧 TODO
- Complete payment & restaurant service layers
- Implement outbox schedulers
- Add logging, tests, monitoring
- Kubernetes deployments

## License

Educational project based on Udemy course materials.
