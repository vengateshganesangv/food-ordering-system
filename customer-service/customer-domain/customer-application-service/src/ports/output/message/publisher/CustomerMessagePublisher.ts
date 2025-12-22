import { CustomerCreatedEvent } from '@food-ordering-system/customer-domain-core';

/**
 * Customer Message Publisher output port
 * Defines the contract for publishing customer domain events to messaging infrastructure
 */
export interface CustomerMessagePublisher {
  /**
   * Publishes a customer created event to the messaging system
   * @param customerCreatedEvent - The customer created event to publish
   */
  publish(customerCreatedEvent: CustomerCreatedEvent): void;
}
