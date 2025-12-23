import { Payment } from '../entity/Payment';
import { PaymentEvent } from './PaymentEvent';

export class PaymentFailedEvent extends PaymentEvent {
  constructor(payment: Payment, createdAt: Date, failureMessages: string[]) {
    super(payment, createdAt, failureMessages);
  }
}
