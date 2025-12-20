# Restaurant Service

Restaurant service for the food ordering system. Handles restaurant approval of orders.

## Architecture

- **Domain Core**: Restaurant entities, value objects, domain services
- **Application Service**: Use cases and ports
- **Dataaccess**: TypeORM repositories
- **Messaging**: Kafka event publishers and listeners
- **Container**: Dependency injection setup

## Status

Core domain-core layer converted. Additional layers need implementation following order-service pattern.
