import { Payment } from '../entity/Payment';
import { PaymentEvent } from './PaymentEvent';

export class PaymentCancelledEvent extends PaymentEvent {
  constructor(payment: Payment, createdAt: Date) {
    super(payment, createdAt, []);
  }
}
