import { BaseId } from '@food-ordering-system/common-domain';

/**
 * Tracking ID value object
 * Used to track orders externally
 */
export class TrackingId extends BaseId<string> {
  constructor(value: string) {
    super(value);
  }
}
