import { Payment } from '../entity/Payment';
import { PaymentEvent } from './PaymentEvent';

export class PaymentCompletedEvent extends PaymentEvent {
  constructor(payment: Payment, createdAt: Date) {
    super(payment, createdAt, []);
  }
}
