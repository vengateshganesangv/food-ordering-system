import { BaseId } from './BaseId';

/**
 * Value object representing a product identifier
 * Uses UUID (string) as the underlying value
 */
export class ProductId extends BaseId<string> {
  constructor(value: string) {
    super(value);
  }
}
