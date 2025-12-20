import { BaseId } from '@food-ordering-system/common-domain';

export class TrackingId extends BaseId<string> {
  constructor(value: string) {
    super(value);
  }
}
