import { BaseId } from '@food-ordering-system/common-domain';

export class PaymentId extends BaseId<string> {
  constructor(value: string) {
    super(value);
  }
}
