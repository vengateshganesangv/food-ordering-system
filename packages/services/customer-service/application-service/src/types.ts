export const TYPES = {
  // Domain
  CustomerDomainService: Symbol.for('CustomerDomainService'),

  // Application Service
  CustomerApplicationService: Symbol.for('CustomerApplicationService'),
  CustomerCreateCommandHandler: Symbol.for('CustomerCreateCommandHandler'),
  CustomerDataMapper: Symbol.for('CustomerDataMapper'),

  // Ports - Output
  CustomerRepository: Symbol.for('CustomerRepository'),
  CustomerMessagePublisher: Symbol.for('CustomerMessagePublisher'),

  // Data Access
  CustomerDataAccessMapper: Symbol.for('CustomerDataAccessMapper'),

  // Messaging
  CustomerMessagingDataMapper: Symbol.for('CustomerMessagingDataMapper'),

  // Infrastructure
  DataSource: Symbol.for('DataSource'),
};
