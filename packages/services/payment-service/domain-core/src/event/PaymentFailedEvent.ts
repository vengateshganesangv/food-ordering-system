import { PaymentEvent } from './PaymentEvent';
import { Payment } from '../entity/Payment';

export class PaymentFailedEvent extends PaymentEvent {
  constructor(payment: Payment, createdAt: Date, failureMessages: string[]) {
    super(payment, createdAt, failureMessages);
  }
}
