import { BaseId } from '@food-ordering-system/common-domain';

export class CreditHistoryId extends BaseId<string> {
  constructor(value: string) {
    super(value);
  }
}
