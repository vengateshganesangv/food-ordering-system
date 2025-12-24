import { BaseId } from '@food-ordering-system/common-domain';

export class OrderApprovalId extends BaseId<string> {
  constructor(value: string) {
    super(value);
  }
}
