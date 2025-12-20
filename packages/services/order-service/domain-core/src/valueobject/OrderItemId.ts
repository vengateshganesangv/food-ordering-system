import { BaseId } from '@food-ordering-system/common-domain';

export class OrderItemId extends BaseId<number> {
  constructor(value: number) {
    super(value);
  }
}
