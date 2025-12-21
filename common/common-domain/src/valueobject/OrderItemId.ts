import { BaseId } from './BaseId';

export class OrderItemId extends BaseId<string> {
  constructor(value: string) {
    super(value);
  }
}
