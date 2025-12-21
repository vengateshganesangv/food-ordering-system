import { BaseId } from './BaseId';

export class TrackingId extends BaseId<string> {
  constructor(value: string) {
    super(value);
  }
}
