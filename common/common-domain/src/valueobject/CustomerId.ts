import { BaseId } from './BaseId';

/**
 * Value object representing a customer identifier
 * Uses UUID (string) as the underlying value
 */
export class CustomerId extends BaseId<string> {
  constructor(value: string) {
    super(value);
  }
}
