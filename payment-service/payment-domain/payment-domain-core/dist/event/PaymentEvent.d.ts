import { DomainEvent } from '@food-ordering-system/common-domain';
import { Payment } from '../entity/Payment';
export declare abstract class PaymentEvent implements DomainEvent<Payment> {
    _phantom?: Payment;
    private readonly payment;
    private readonly createdAt;
    private readonly failureMessages;
    constructor(payment: Payment, createdAt: Date, failureMessages: string[]);
    getPayment(): Payment;
    getCreatedAt(): Date;
    getFailureMessages(): string[];
}
//# sourceMappingURL=PaymentEvent.d.ts.map