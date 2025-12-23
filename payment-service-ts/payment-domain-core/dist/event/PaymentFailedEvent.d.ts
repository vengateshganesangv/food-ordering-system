import { Payment } from '../entity/Payment';
import { PaymentEvent } from './PaymentEvent';
export declare class PaymentFailedEvent extends PaymentEvent {
    constructor(payment: Payment, createdAt: Date, failureMessages: string[]);
}
