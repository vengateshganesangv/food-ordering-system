/**
 * Domain-wide constants
 */
export class DomainConstants {
  private constructor() {
    // Private constructor to prevent instantiation
  }

  public static readonly UTC = 'UTC';
}

/**
 * Saga name constant for order service
 */
export const ORDER_SAGA_NAME = 'OrderProcessingSaga';
