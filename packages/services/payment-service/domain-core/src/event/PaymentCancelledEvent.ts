import { PaymentEvent } from './PaymentEvent';
import { Payment } from '../entity/Payment';

export class PaymentCancelledEvent extends PaymentEvent {
  constructor(payment: Payment, createdAt: Date) {
    super(payment, createdAt, []);
  }
}
