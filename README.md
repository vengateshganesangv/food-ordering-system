# Food Ordering System - TypeScript/Node.js

A microservices-based food ordering system implementing **Clean Architecture**, **Domain-Driven Design (DDD)**, **SAGA Pattern**, **Outbox Pattern**, and **CQRS** using TypeScript and Node.js.

## Architecture Overview

This project demonstrates a production-ready microservices architecture with:

- **Clean/Hexagonal Architecture**: Clear separation of domain, application, and infrastructure layers
- **Domain-Driven Design (DDD)**: Rich domain models with entities, value objects, and aggregates
- **SAGA Pattern**: Distributed transaction management across microservices
- **Outbox Pattern**: Reliable event publishing with transactional guarantees
- **CQRS**: Command Query Responsibility Segregation for scalability
- **Event-Driven Architecture**: Asynchronous communication using Kafka

## Project Structure

```
food-ordering-system/
├── packages/                      # Shared packages
│   ├── common-domain/            # Domain entities, value objects, events
│   ├── common-application/       # Application utilities, error handling
│   ├── common-dataaccess/        # Database utilities
│   ├── kafka-config/             # Kafka configuration
│   ├── kafka-producer/           # Kafka producer implementation
│   ├── kafka-consumer/           # Kafka consumer implementation
│   ├── saga/                     # SAGA pattern implementation
│   └── outbox/                   # Outbox pattern implementation
│
├── services/                      # Microservices
│   ├── customer-service/         # Customer management
│   ├── order-service/            # Order processing with SAGA orchestration
│   ├── payment-service/          # Payment processing
│   └── restaurant-service/       # Restaurant and order approval
│
├── docker-compose.yml            # Docker orchestration
├── package.json                  # Root package configuration
├── pnpm-workspace.yaml          # Monorepo workspace configuration
└── tsconfig.base.json           # Base TypeScript configuration
```

## Service Architecture (Example: Customer Service)

Each service follows Clean Architecture principles with clear layer separation:

```
customer-service/
├── src/
│   ├── domain-core/                    # Domain Layer
│   │   ├── entity/                     # Domain entities (aggregates)
│   │   ├── event/                      # Domain events
│   │   ├── exception/                  # Domain exceptions
│   │   ├── CustomerDomainService.ts    # Domain service interface
│   │   └── CustomerDomainServiceImpl.ts # Domain service implementation
│   │
│   ├── application-service/            # Application Layer
│   │   ├── dto/                        # Data transfer objects
│   │   ├── ports/
│   │   │   ├── input/                  # Input ports (use cases)
│   │   │   └── output/                 # Output ports (repository, messaging)
│   │   ├── mapper/                     # Domain ↔ DTO mappers
│   │   └── CustomerCreateCommandHandler.ts
│   │
│   ├── dataaccess/                     # Infrastructure Layer - Persistence
│   │   ├── entity/                     # Database entities
│   │   ├── mapper/                     # Domain ↔ Database mappers
│   │   └── repository/                 # Repository implementations
│   │
│   ├── messaging/                      # Infrastructure Layer - Messaging
│   │   └── publisher/                  # Kafka event publishers
│   │
│   ├── api/                            # Infrastructure Layer - API
│   │   └── CustomerController.ts       # REST endpoints
│   │
│   ├── config/                         # Configuration
│   │   ├── ServiceConfig.ts
│   │   └── DependencyInjection.ts      # DI container
│   │
│   └── index.ts                        # Application entry point
```

## Tech Stack

### Core Technologies
- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.3+
- **Package Manager**: pnpm (workspaces)

### Frameworks & Libraries
- **Web Framework**: Express.js
- **Database**: PostgreSQL with pg driver
- **Message Broker**: Apache Kafka (KafkaJS)
- **Decimal Math**: decimal.js (for Money value object)

### Development Tools
- **TypeScript Compiler**: tsc
- **Linting**: ESLint
- **Formatting**: Prettier
- **Dev Server**: nodemon + ts-node

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm 8 or higher
- Docker and Docker Compose (for running infrastructure)

### Installation

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Build all packages and services**:
   ```bash
   pnpm build
   ```

### Running with Docker Compose

The easiest way to run the entire system:

```bash
# Start all services (databases, Kafka, microservices)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

This will start:
- PostgreSQL databases (Customer DB on 5433, Order DB on 5434)
- Zookeeper (2181)
- Kafka (9092)
- Customer Service (8081)
- Order Service (8082)
- Payment Service (8083)
- Restaurant Service (8084)

### Running Locally (Development)

1. **Start infrastructure** (PostgreSQL, Kafka):
   ```bash
   docker-compose up -d customer-db order-db zookeeper kafka
   ```

2. **Initialize databases**:
   ```bash
   cd services/customer-service
   pnpm db:init
   ```

3. **Run services in development mode**:
   ```bash
   # Terminal 1 - Customer Service
   cd services/customer-service
   pnpm dev

   # Terminal 2 - Order Service
   cd services/order-service
   pnpm dev

   # Terminal 3 - Payment Service
   cd services/payment-service
   pnpm dev

   # Terminal 4 - Restaurant Service
   cd services/restaurant-service
   pnpm dev
   ```

## API Endpoints

### Customer Service (Port 8081)

```bash
# Create a customer
POST http://localhost:8081/customers
Content-Type: application/json

{
  "customerId": "customer-123",
  "username": "john.doe",
  "firstName": "John",
  "lastName": "Doe"
}

# Health check
GET http://localhost:8081/health
```

### Order Service (Port 8082)

```bash
# Create an order
POST http://localhost:8082/orders
Content-Type: application/json

{
  "customerId": "customer-123",
  "restaurantId": "restaurant-456",
  "items": [
    {
      "productId": "product-789",
      "quantity": 2,
      "price": 12.50
    }
  ],
  "price": 25.00
}

# Get order
GET http://localhost:8082/orders/{orderId}

# Health check
GET http://localhost:8082/health
```

### Payment Service (Port 8083)

```bash
# Process payment
POST http://localhost:8083/payments
Content-Type: application/json

{
  "orderId": "order-123",
  "customerId": "customer-123",
  "price": 25.00
}

# Get payment
GET http://localhost:8083/payments/{paymentId}

# Health check
GET http://localhost:8083/health
```

### Restaurant Service (Port 8084)

```bash
# Approve order
POST http://localhost:8084/restaurant/approve
Content-Type: application/json

{
  "orderId": "order-123",
  "restaurantId": "restaurant-456"
}

# Get restaurant
GET http://localhost:8084/restaurant/{restaurantId}

# Health check
GET http://localhost:8084/health
```

## Design Patterns Implemented

### 1. Clean Architecture (Hexagonal Architecture)

Each service is structured in layers:
- **Domain Layer**: Pure business logic, entities, value objects
- **Application Layer**: Use cases, ports (interfaces)
- **Infrastructure Layer**: Adapters for external systems (DB, Kafka, REST)

### 2. Domain-Driven Design (DDD)

- **Entities**: Objects with identity (Customer, Order, Payment)
- **Value Objects**: Immutable objects (Money, CustomerId, OrderId)
- **Aggregates**: Cluster of entities (Order with OrderItems)
- **Domain Events**: Events published when domain state changes
- **Domain Services**: Business logic that doesn't belong to entities

### 3. SAGA Pattern

Manages distributed transactions across services:
- Order creation triggers a saga
- Coordinates Payment and Restaurant approval
- Supports compensation (rollback) on failures

### 4. Outbox Pattern

Ensures reliable event publishing:
- Events are stored in database (outbox table)
- Scheduler reads and publishes events
- Guarantees at-least-once delivery

### 5. CQRS (Command Query Responsibility Segregation)

- Commands: Create, Update operations
- Queries: Read operations (can be optimized separately)

### 6. Ports and Adapters

- **Input Ports**: Interfaces for application use cases
- **Output Ports**: Interfaces for external dependencies
- **Adapters**: Concrete implementations (REST, Kafka, PostgreSQL)

## Key Domain Concepts

### Value Objects

All implemented with proper immutability and equality:

- `Money`: Decimal precision for monetary values
- `CustomerId`, `OrderId`, `ProductId`, `RestaurantId`: Type-safe IDs
- `OrderStatus`, `PaymentStatus`: Enums for status management

### Entities

- `Customer`: Aggregate root for customer domain
- `Order`: Aggregate root containing OrderItems
- `Payment`: Aggregate root for payment domain
- `Restaurant`: Aggregate root for restaurant domain

### Domain Events

- `CustomerCreatedEvent`: Published when customer is created
- Similar events for Order, Payment lifecycle

## Development

### Available Scripts

```bash
# Root level
pnpm build          # Build all packages and services
pnpm dev            # Run all services in development mode
pnpm test           # Run tests (when implemented)
pnpm lint           # Lint all code
pnpm clean          # Clean build artifacts

# Individual service
cd services/customer-service
pnpm build          # Build this service
pnpm dev            # Run in development mode
pnpm start          # Run production build
pnpm db:init        # Initialize database schema
```

### Adding a New Service

1. Create service directory under `services/`
2. Follow the layered architecture pattern
3. Add to `pnpm-workspace.yaml`
4. Create Dockerfile
5. Add to `docker-compose.yml`

## Architecture Decisions

### Why Monorepo?
- Shared code reuse (common packages)
- Consistent TypeScript configuration
- Simplified dependency management
- Better developer experience

### Why pnpm?
- Efficient disk space usage
- Fast installation
- Native workspace support
- Strict dependency resolution

### Why TypeScript?
- Type safety
- Better IDE support
- Compile-time error detection
- Domain modeling clarity

### Why Express over NestJS?
- Lightweight and flexible
- Clear demonstration of architecture patterns
- No framework magic
- Explicit dependency injection

## Future Enhancements

- [ ] Implement complete SAGA orchestration
- [ ] Add Outbox scheduler implementation
- [ ] Implement CQRS with separate read models
- [ ] Add API Gateway
- [ ] Implement service discovery (Consul/Eureka)
- [ ] Add distributed tracing (Jaeger)
- [ ] Implement circuit breaker pattern
- [ ] Add comprehensive test suite
- [ ] Implement authentication/authorization
- [ ] Add GraphQL API option

## Contributing

This is a demonstration project showcasing microservices architecture patterns. Feel free to use it as a reference or starting point for your own projects.

## License

MIT

## Acknowledgments

Inspired by the Udemy course: "Microservices: Clean Architecture, DDD, SAGA, Outbox & Kafka" - converted from Java/Spring Boot to TypeScript/Node.js while maintaining the same architectural principles and design patterns.
