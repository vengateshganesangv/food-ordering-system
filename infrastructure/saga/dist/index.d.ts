/**
 * SAGA Infrastructure Module
 *
 * This module provides the core abstractions for implementing the SAGA pattern
 * in a distributed transaction context. The SAGA pattern ensures data consistency
 * across microservices by coordinating a sequence of local transactions.
 *
 * @module @food-ordering-system/saga
 */
export { SagaStatus } from './SagaStatus';
export type { SagaStep } from './SagaStep';
export { ORDER_SAGA_NAME } from './order/SagaConstants';
//# sourceMappingURL=index.d.ts.map