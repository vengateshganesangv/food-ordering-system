import { Payment } from './entity/Payment';
import { CreditEntry } from './entity/CreditEntry';
import { CreditHistory } from './entity/CreditHistory';
import { PaymentEvent } from './event/PaymentEvent';
import { PaymentDomainService } from './PaymentDomainService';
export declare class PaymentDomainServiceImpl implements PaymentDomainService {
    validateAndInitiatePayment(payment: Payment, creditEntry: CreditEntry, creditHistories: CreditHistory[], failureMessages: string[]): PaymentEvent;
    validateAndCancelPayment(payment: Payment, creditEntry: CreditEntry, creditHistories: CreditHistory[], failureMessages: string[]): PaymentEvent;
    private validateCreditEntry;
    private subtractCreditEntry;
    private updateCreditHistory;
    private validateCreditHistory;
    private getTotalHistoryAmount;
    private addCreditEntry;
}
