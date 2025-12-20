# Payment Service

Payment service for the food ordering system. Handles payment processing and credit management.

## Architecture

- **Domain Core**: Payment entities, value objects, domain services
- **Application Service**: Use cases and ports
- **Dataaccess**: TypeORM repositories
- **Messaging**: Kafka event publishers and listeners
- **Container**: Dependency injection setup

## Status

Core domain-core layer converted. Additional layers need implementation following order-service pattern.
