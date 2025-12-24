# Food Ordering System - Node.js/TypeScript

A microservices-based food ordering system built with **Clean Architecture**, **Domain-Driven Design (DDD)**, **SAGA Pattern**, and **Outbox Pattern**. This project was converted from Java/Spring Boot to Node.js/TypeScript while preserving all architectural patterns and business logic.

> **Note**: This project is based on the Udemy course: [Microservices: Clean Architecture, DDD, SAGA, Outbox & Kafka](https://www.udemy.com/course/microservices-clean-architecture-ddd-saga-outbox-kafka-kubernetes/?referralCode=D9CF425EC696F08E501F), but has been fully converted from Java/Spring Boot to Node.js/TypeScript.

## 🏗️ Architecture

### Design Patterns
- **Clean Architecture** - Clear separation of concerns
- **Hexagonal Architecture** - Ports and adapters pattern
- **Domain-Driven Design (DDD)** - Rich domain models with aggregates, entities, and value objects
- **SAGA Pattern** - Distributed transaction coordination
- **Outbox Pattern** - Reliable async messaging with transactional guarantees
- **CQRS** - Command-query responsibility segregation
- **Event-Driven Architecture** - Apache Kafka for inter-service communication

### Technology Stack

| Component | Technology |
|-----------|-----------|
| **Runtime** | Node.js 18+ |
| **Language** | TypeScript 5.3+ |
| **Framework** | Express.js 4.18 |
| **ORM** | TypeORM 0.3.19 |
| **Database** | PostgreSQL 14 |
| **Messaging** | Apache Kafka 3.0 + KafkaJS |
| **Scheduling** | node-cron |
| **Containerization** | Docker & Docker Compose |

## 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Docker** 20.10 or higher
- **Docker Compose** 2.0 or higher
- **PostgreSQL** 14 or higher (for local development)
- **Apache Kafka** 3.0 or higher (for local development)

## 🚀 Quick Start with Docker Compose

The easiest way to run the entire system is using Docker Compose:

```bash
# 1. Clone the repository
git clone <repository-url>
cd food-ordering-system

# 2. Start all services (infrastructure + microservices)
npm run docker:up

# 3. View logs
npm run docker:logs

# 4. Stop all services
npm run docker:down

# 5. Clean up (remove volumes)
npm run docker:clean
```

This will start:
- **3 Kafka brokers** (ports 19092, 29092, 39092)
- **Zookeeper** (port 2181)
- **Schema Registry** (port 8081)
- **PostgreSQL** (port 5432)
- **Customer Service** (port 8184)
- **Payment Service** (port 8182)
- **Restaurant Service** (port 8183)
- **Order Service** (port 8181)

## 🛠️ Local Development Setup

For local development without Docker:

### 1. Install Dependencies

```bash
# Install all workspace dependencies
npm install

# Build all modules
npm run build
```

### 2. Start Infrastructure

You'll need PostgreSQL and Kafka running locally:

**Option A: Use Docker for infrastructure only**
```bash
docker-compose up -d postgres zookeeper kafka-broker-1 kafka-broker-2 kafka-broker-3 schema-registry
```

**Option B: Install and run locally**
- PostgreSQL on port 5432
- Kafka brokers on ports 19092, 29092, 39092

### 3. Initialize Database

```bash
# Connect to PostgreSQL and run initialization scripts
psql -U postgres -d postgres -f database/init-scripts/01-create-schemas.sql
psql -U postgres -d postgres -f database/init-scripts/02-customer-schema.sql
psql -U postgres -d postgres -f database/init-scripts/03-payment-schema.sql
psql -U postgres -d postgres -f database/init-scripts/04-restaurant-schema.sql
psql -U postgres -d postgres -f database/init-scripts/05-order-schema.sql
```

### 4. Start Services

```bash
# Start all services concurrently
npm run dev

# Or start individually
npm run customer:dev    # Customer Service on port 8184
npm run payment:dev     # Payment Service on port 8182
npm run restaurant:dev  # Restaurant Service on port 8183
npm run order:dev       # Order Service on port 8181
```

## 📦 Project Structure

```
food-ordering-system/
├── common/                          # Shared modules
│   ├── common-domain/               # Domain primitives
│   ├── common-application/          # Application utilities
│   └── common-dataaccess/           # Shared entities
├── infrastructure/                  # Infrastructure modules
│   ├── kafka-producer/              # Kafka producer
│   ├── kafka-consumer/              # Kafka consumer
│   ├── kafka-model/                 # Avro models
│   ├── saga/                        # SAGA framework
│   └── outbox/                      # Outbox framework
├── customer-service-ts/             # Customer microservice
├── payment-service-ts/              # Payment microservice
├── restaurant-service-ts/           # Restaurant microservice
├── order-service-ts/                # Order microservice
├── database/init-scripts/           # Database initialization
└── docker-compose.yml               # Docker orchestration
```

## 🔌 API Endpoints

### Order Service (Port 8181)
```bash
# Create an order
POST http://localhost:8181/orders

# Track an order
GET http://localhost:8181/orders/{trackingId}

# Health check
GET http://localhost:8181/health
```

### Customer Service (Port 8184)
```bash
# Create a customer
POST http://localhost:8184/customers

# Get customer
GET http://localhost:8184/customers/{customerId}
```

## 📝 Example: Create an Order

```bash
curl -X POST http://localhost:8181/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "d215b5f8-0249-4dc5-89a3-51fd148cfb41",
    "restaurantId": "d215b5f8-0249-4dc5-89a3-51fd148cfb45",
    "price": 200.00,
    "items": [
      {
        "productId": "d215b5f8-0249-4dc5-89a3-51fd148cfb48",
        "quantity": 1,
        "price": 50.00,
        "subTotal": 50.00
      },
      {
        "productId": "d215b5f8-0249-4dc5-89a3-51fd148cfb49",
        "quantity": 3,
        "price": 50.00,
        "subTotal": 150.00
      }
    ],
    "address": {
      "street": "123 Main St",
      "postalCode": "12345",
      "city": "New York"
    }
  }'
```

## 🔄 Order Flow (SAGA)

1. **Order Service** creates order (status: `PENDING`)
2. **Payment Service** processes payment → Order becomes `PAID`
3. **Restaurant Service** approves order → Order becomes `APPROVED`

See [CONVERSION_SUMMARY.md](./CONVERSION_SUMMARY.md) for detailed flow diagrams.

## 📊 Available Scripts

```bash
npm run build           # Build all workspaces
npm run clean           # Clean build artifacts
npm run dev             # Start all services
npm run docker:up       # Start with Docker Compose
npm run docker:down     # Stop containers
npm run docker:logs     # View logs
```

## 📚 Documentation

- **[CONVERSION_SUMMARY.md](./CONVERSION_SUMMARY.md)** - Detailed conversion documentation with architecture, patterns, and statistics

## 🙏 Acknowledgments

This project demonstrates:
- ✅ 263 TypeScript files
- ✅ 14 modules
- ✅ ~12,000 lines of code
- ✅ 100% conversion from Java/Spring Boot
- ✅ All patterns preserved

---

**Built with ❤️ using Node.js, TypeScript, Express.js, TypeORM, and Apache Kafka**


