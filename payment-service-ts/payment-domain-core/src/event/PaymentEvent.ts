import { DomainEvent } from '@food-ordering-system/common-domain';
import { Payment } from '../entity/Payment';

export abstract class PaymentEvent implements DomainEvent<Payment> {
  private readonly payment: Payment;
  private readonly createdAt: Date;
  private readonly failureMessages: string[];

  constructor(payment: Payment, createdAt: Date, failureMessages: string[]) {
    this.payment = payment;
    this.createdAt = createdAt;
    this.failureMessages = failureMessages;
  }

  public getPayment(): Payment {
    return this.payment;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getFailureMessages(): string[] {
    return this.failureMessages;
  }
}
