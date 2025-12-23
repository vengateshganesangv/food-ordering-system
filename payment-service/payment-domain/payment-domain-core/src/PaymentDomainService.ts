import { Payment } from './entity/Payment';
import { CreditEntry } from './entity/CreditEntry';
import { CreditHistory } from './entity/CreditHistory';
import { PaymentEvent } from './event/PaymentEvent';

export interface PaymentDomainService {
  validateAndInitiatePayment(
    payment: Payment,
    creditEntry: CreditEntry,
    creditHistories: CreditHistory[],
    failureMessages: string[]
  ): PaymentEvent;

  validateAndCancelPayment(
    payment: Payment,
    creditEntry: CreditEntry,
    creditHistories: CreditHistory[],
    failureMessages: string[]
  ): PaymentEvent;
}
