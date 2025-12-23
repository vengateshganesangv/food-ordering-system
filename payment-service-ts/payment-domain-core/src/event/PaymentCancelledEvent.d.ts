import { Payment } from '../entity/Payment';
import { PaymentEvent } from './PaymentEvent';
export declare class PaymentCancelledEvent extends PaymentEvent {
    constructor(payment: Payment, createdAt: Date);
}
