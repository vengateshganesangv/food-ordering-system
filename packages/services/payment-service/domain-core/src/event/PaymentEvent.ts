import { DomainEvent } from '@food-ordering-system/common-domain';
import { Payment } from '../entity/Payment';

export abstract class PaymentEvent implements DomainEvent<Payment> {
  private readonly _payment: Payment;
  private readonly _createdAt: Date;
  private readonly _failureMessages: string[];

  constructor(payment: Payment, createdAt: Date, failureMessages: string[]) {
    this._payment = payment;
    this._createdAt = createdAt;
    this._failureMessages = failureMessages;
  }

  get payment(): Payment {
    return this._payment;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get failureMessages(): string[] {
    return this._failureMessages;
  }
}
