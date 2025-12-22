import { BaseId } from './BaseId';

/**
 * Value object representing an order identifier
 * Uses UUID (string) as the underlying value
 */
export class OrderId extends BaseId<string> {
  constructor(value: string) {
    super(value);
  }
}
