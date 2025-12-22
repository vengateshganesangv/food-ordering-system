/**
 * Enum representing the various states of a SAGA transaction.
 *
 * The SAGA pattern is used for managing distributed transactions by breaking them
 * into a series of local transactions. Each state represents a different phase
 * in the SAGA's lifecycle.
 *
 * @enum {string}
 */
export enum SagaStatus {
  /**
   * The SAGA has been initiated and is ready to begin processing
   */
  STARTED = 'STARTED',

  /**
   * The SAGA has encountered an error and has failed
   */
  FAILED = 'FAILED',

  /**
   * The SAGA has completed all steps successfully
   */
  SUCCEEDED = 'SUCCEEDED',

  /**
   * The SAGA is currently executing its forward transaction steps
   */
  PROCESSING = 'PROCESSING',

  /**
   * The SAGA is executing compensating transactions (rollback) due to a failure
   */
  COMPENSATING = 'COMPENSATING',

  /**
   * The SAGA has successfully completed all compensating transactions (rollback complete)
   */
  COMPENSATED = 'COMPENSATED'
}
