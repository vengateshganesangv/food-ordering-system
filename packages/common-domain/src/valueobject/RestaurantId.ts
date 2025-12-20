import { BaseId } from './BaseId';

export class RestaurantId extends BaseId<string> {
  constructor(value: string) {
    super(value);
  }
}
