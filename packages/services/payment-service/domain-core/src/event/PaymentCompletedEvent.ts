import { PaymentEvent } from './PaymentEvent';
import { Payment } from '../entity/Payment';

export class PaymentCompletedEvent extends PaymentEvent {
  constructor(payment: Payment, createdAt: Date) {
    super(payment, createdAt, []);
  }
}
