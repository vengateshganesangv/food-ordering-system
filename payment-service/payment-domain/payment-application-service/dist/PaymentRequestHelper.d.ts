import { PaymentDomainService } from '@food-ordering-system/payment-domain-core';
import { PaymentRequest } from './dto/PaymentRequest';
import { PaymentDataMapper } from './mapper/PaymentDataMapper';
import { OrderOutboxHelper } from './outbox/scheduler/OrderOutboxHelper';
import { PaymentResponseMessagePublisher } from './ports/output/message/publisher/PaymentResponseMessagePublisher';
import { PaymentRepository } from './ports/output/repository/PaymentRepository';
import { CreditEntryRepository } from './ports/output/repository/CreditEntryRepository';
import { CreditHistoryRepository } from './ports/output/repository/CreditHistoryRepository';
export declare class PaymentRequestHelper {
    private readonly paymentDomainService;
    private readonly paymentDataMapper;
    private readonly paymentRepository;
    private readonly creditEntryRepository;
    private readonly creditHistoryRepository;
    private readonly orderOutboxHelper;
    private readonly paymentResponseMessagePublisher;
    constructor(paymentDomainService: PaymentDomainService, paymentDataMapper: PaymentDataMapper, paymentRepository: PaymentRepository, creditEntryRepository: CreditEntryRepository, creditHistoryRepository: CreditHistoryRepository, orderOutboxHelper: OrderOutboxHelper, paymentResponseMessagePublisher: PaymentResponseMessagePublisher);
    persistPayment(paymentRequest: PaymentRequest): Promise<void>;
    persistCancelPayment(paymentRequest: PaymentRequest): Promise<void>;
    private getCreditEntry;
    private getCreditHistory;
    private persistDbObjects;
    private publishIfOutboxMessageProcessedForPayment;
}
//# sourceMappingURL=PaymentRequestHelper.d.ts.map