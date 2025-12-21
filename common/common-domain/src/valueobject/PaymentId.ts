import { BaseId } from './BaseId';

export class PaymentId extends BaseId<string> {
  constructor(value: string) {
    super(value);
  }
}
