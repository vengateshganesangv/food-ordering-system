import { BaseId } from '@food-ordering-system/common-domain';

export class CreditEntryId extends BaseId<string> {
  constructor(value: string) {
    super(value);
  }
}
