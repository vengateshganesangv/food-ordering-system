import { BaseEntity, CustomerId, Money } from '@food-ordering-system/common-domain';
import { CreditHistoryId } from '../valueobject/CreditHistoryId';
import { TransactionType } from '../valueobject/TransactionType';
export interface CreditHistoryProps {
    creditHistoryId?: CreditHistoryId;
    customerId: CustomerId;
    amount: Money;
    transactionType: TransactionType;
}
export declare class CreditHistory extends BaseEntity<CreditHistoryId> {
    private readonly customerId;
    private readonly amount;
    private readonly transactionType;
    private constructor();
    getCustomerId(): CustomerId;
    getAmount(): Money;
    getTransactionType(): TransactionType;
    static builder(): InstanceType<typeof CreditHistory.Builder>;
    static Builder: {
        new (): {
            creditHistoryId?: CreditHistoryId;
            customerId?: CustomerId;
            amount?: Money;
            transactionType?: TransactionType;
            setCreditHistoryId(creditHistoryId: CreditHistoryId): /*elided*/ any;
            setCustomerId(customerId: CustomerId): /*elided*/ any;
            setAmount(amount: Money): /*elided*/ any;
            setTransactionType(transactionType: TransactionType): /*elided*/ any;
            build(): CreditHistory;
        };
    };
}
