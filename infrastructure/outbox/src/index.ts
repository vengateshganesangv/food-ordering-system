/**
 * Outbox Infrastructure Module
 *
 * This module provides the core abstractions for implementing the Outbox pattern
 * in a microservices architecture. The Outbox pattern ensures reliable message
 * publishing by storing messages in a database before publishing them to a message broker.
 *
 * @module @food-ordering-system/outbox
 */

export { OutboxStatus } from './OutboxStatus';
export type { OutboxScheduler } from './OutboxScheduler';
export { SchedulerConfig } from './config/SchedulerConfig';
