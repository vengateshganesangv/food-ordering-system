import { BaseId } from './BaseId';

/**
 * Value object representing a restaurant identifier
 * Uses UUID (string) as the underlying value
 */
export class RestaurantId extends BaseId<string> {
  constructor(value: string) {
    super(value);
  }
}
