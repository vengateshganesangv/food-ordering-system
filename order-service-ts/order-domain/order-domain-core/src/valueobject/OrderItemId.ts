import { BaseId } from '@food-ordering-system/common-domain';

/**
 * Order Item ID value object
 * Sequential ID for items within an order
 */
export class OrderItemId extends BaseId<number> {
  constructor(value: number) {
    super(value);
  }
}
