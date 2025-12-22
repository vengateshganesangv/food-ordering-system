# Payment Service - TypeScript/Node.js Implementation

A complete TypeScript/Node.js conversion of the Payment Service microservice from the Food Ordering System. This service handles payment processing, credit management, and implements the Transactional Outbox pattern for reliable messaging.

## Architecture

The service follows Clean Architecture / Hexagonal Architecture principles with the following layers:

```
payment-service-ts/
├── payment-domain-core/          # Domain layer - Core business logic
│   ├── entity/                   # Domain entities (Payment, CreditEntry, CreditHistory)
│   ├── valueobject/              # Value objects (PaymentId, TransactionType, etc.)
│   ├── event/                    # Domain events
│   ├── exception/                # Domain exceptions
│   └── PaymentDomainService      # Domain service with business logic
│
├── payment-application-service/  # Application layer - Use cases & orchestration
│   ├── ports/                    # Interfaces (input/output ports)
│   ├── dto/                      # Data Transfer Objects
│   ├── outbox/                   # Outbox pattern implementation
│   ├── mapper/                   # Data mappers
│   └── PaymentRequestHelper      # Application service
│
├── payment-dataaccess/           # Infrastructure layer - Database
│   ├── payment/                  # Payment repository & entities
│   ├── creditentry/              # Credit entry repository & entities
│   ├── credithistory/            # Credit history repository & entities
│   └── outbox/                   # Outbox repository & entities
│
├── payment-messaging/            # Infrastructure layer - Messaging
│   ├── listener/                 # Kafka consumers
│   ├── publisher/                # Kafka producers
│   └── mapper/                   # Message mappers
│
└── payment-service/              # Main application & DI container
    ├── config/                   # Configuration & DI setup
    ├── scripts/                  # Database initialization scripts
    └── index.ts                  # Application entry point
```

## Key Features

### 1. Payment Processing
- **Payment validation and initialization**
- **Credit entry verification** - Ensures customer has sufficient credit
- **Credit history tracking** - Maintains audit trail of all transactions
- **Payment state transitions** - COMPLETED, CANCELLED, FAILED states

### 2. Credit Management
- **Credit Entry** - Tracks total credit amount per customer
- **Credit History** - Records all credit/debit transactions
- **Transaction Types** - CREDIT (add funds) and DEBIT (subtract funds)
- **Validation** - Ensures credit history consistency

### 3. Transactional Outbox Pattern
- **Reliable messaging** - Guarantees message delivery to Kafka
- **Outbox scheduler** - Publishes pending messages every 10 seconds
- **Outbox cleaner** - Removes completed messages daily at midnight
- **Idempotency** - Prevents duplicate message processing

### 4. Database Schema
```sql
-- Payment schema in PostgreSQL
- payments          # Payment records
- credit_entry      # Customer credit balances
- credit_history    # Transaction history
- order_outbox      # Outbox pattern messages
```

## Technology Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript 5.3+
- **Framework**: Express.js
- **Database**: PostgreSQL with TypeORM
- **Messaging**: Apache Kafka (KafkaJS)
- **DI Container**: TSyringe
- **Scheduling**: node-cron
- **Configuration**: YAML (js-yaml)

## Installation

### Prerequisites
- Node.js 20 or higher
- PostgreSQL 13 or higher
- Apache Kafka 3.0 or higher

### Database Setup

1. Create the database and schema:
```bash
psql -U postgres -c "CREATE DATABASE postgres;"
```

2. Run the schema initialization:
```bash
psql -U postgres -d postgres -f payment-service/src/scripts/init-schema.sql
```

3. Load initial data:
```bash
psql -U postgres -d postgres -f payment-service/src/scripts/init-data.sql
```

### Install Dependencies

```bash
# Install dependencies for all packages
cd payment-domain-core && npm install && cd ..
cd payment-application-service && npm install && cd ..
cd payment-dataaccess && npm install && cd ..
cd payment-messaging && npm install && cd ..
cd payment-service && npm install && cd ..
```

### Build All Packages

```bash
# Build in dependency order
cd payment-domain-core && npm run build && cd ..
cd payment-application-service && npm run build && cd ..
cd payment-dataaccess && npm run build && cd ..
cd payment-messaging && npm run build && cd ..
cd payment-service && npm run build && cd ..
```

## Configuration

Edit `payment-service/src/config/application-config.yml`:

```yaml
server:
  port: 8182

payment-service:
  payment-request-topic-name: payment-request
  payment-response-topic-name: payment-response
  outbox-scheduler-fixed-rate: 10000
  outbox-scheduler-initial-delay: 10000

database:
  host: localhost
  port: 5432
  database: postgres
  schema: payment
  username: postgres
  password: admin

kafka-config:
  bootstrap-servers:
    - localhost:19092
    - localhost:29092
    - localhost:39092
```

## Running the Service

### Development Mode
```bash
cd payment-service
npm run dev
```

### Production Mode
```bash
cd payment-service
npm run build
npm start
```

## API Endpoints

### Health Check
```
GET /health
Response: { "status": "UP", "service": "payment-service" }
```

## Message Contracts

### Consumed Messages
**Topic**: `payment-request`

```json
{
  "id": "uuid",
  "sagaId": "uuid",
  "customerId": "uuid",
  "orderId": "uuid",
  "price": 100.00,
  "createdAt": "2025-01-01T00:00:00Z",
  "paymentOrderStatus": "PENDING|CANCELLED"
}
```

### Published Messages
**Topic**: `payment-response`

```json
{
  "id": "uuid",
  "sagaId": "uuid",
  "paymentId": "uuid",
  "customerId": "uuid",
  "orderId": "uuid",
  "price": 100.00,
  "createdAt": "2025-01-01T00:00:00Z",
  "paymentStatus": "COMPLETED|CANCELLED|FAILED",
  "failureMessages": []
}
```

## Business Logic Highlights

### Payment Initiation Flow
1. Validate payment request
2. Initialize payment with new ID
3. Validate customer has sufficient credit
4. Subtract credit amount from customer's credit entry
5. Add debit transaction to credit history
6. Validate credit history consistency
7. Save payment, credit entry, and credit history
8. Create outbox message for async publishing

### Payment Cancellation Flow
1. Validate payment exists
2. Add credit amount back to customer's credit entry
3. Add credit transaction to credit history
4. Update payment status to CANCELLED
5. Save changes
6. Create outbox message for notification

### Credit Validation
```typescript
// Ensure customer has enough credit
if (payment.price > creditEntry.totalCreditAmount) {
  failureMessages.push("Customer doesn't have enough credit");
}

// Validate credit history consistency
const totalCredit = sum(creditHistories.filter(CREDIT));
const totalDebit = sum(creditHistories.filter(DEBIT));
if (creditEntry.totalCreditAmount !== totalCredit - totalDebit) {
  failureMessages.push("Credit history inconsistent");
}
```

## File Count Summary

Total: **58 TypeScript files** converted from Java

### By Module:
- **Domain Core**: 15 files (entities, value objects, events, exceptions, domain service)
- **Application Service**: 17 files (ports, DTOs, outbox, mappers, helpers)
- **Data Access**: 23 files (entities, repositories, adapters, mappers for 4 data models)
- **Messaging**: 3 files (Kafka listener, publisher, mapper)
- **Container**: 4 files (main app, DI container, config loader, YAML config)

## Testing

The initial data includes two test customers:
- Customer 1: `d215b5f8-0249-4dc5-89a3-51fd148cfb41` - $500.00 credit
- Customer 2: `d215b5f8-0249-4dc5-89a3-51fd148cfb43` - $100.00 credit

## Scheduler Configuration

### Outbox Message Publisher
- **Interval**: 10 seconds (configurable)
- **Function**: Publishes pending outbox messages to Kafka
- **Status**: STARTED → COMPLETED

### Outbox Message Cleaner
- **Schedule**: Daily at midnight
- **Function**: Deletes completed outbox messages
- **Purpose**: Prevent unbounded table growth

## Error Handling

- **Unique constraint violations**: Logged but not propagated (idempotency)
- **Payment not found**: Logged for cancellation requests
- **Insufficient credit**: Added to failure messages, payment marked as FAILED
- **Database errors**: Propagated as PaymentApplicationServiceException

## Migration Notes

All business logic from the Java implementation has been preserved:
- ✅ Payment validation and state management
- ✅ Credit entry and credit history tracking
- ✅ Transactional outbox pattern
- ✅ Kafka message handling
- ✅ Idempotency and error handling
- ✅ Domain-driven design principles
- ✅ Clean architecture separation of concerns

## License

ISC
