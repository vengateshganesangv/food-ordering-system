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
    static builder(): CreditHistoryBuilder;
}
declare class CreditHistoryBuilder {
    private creditHistoryId?;
    private customerId?;
    private amount?;
    private transactionType?;
    setCreditHistoryId(creditHistoryId: CreditHistoryId): CreditHistoryBuilder;
    setCustomerId(customerId: CustomerId): CreditHistoryBuilder;
    setAmount(amount: Money): CreditHistoryBuilder;
    setTransactionType(transactionType: TransactionType): CreditHistoryBuilder;
    build(): CreditHistory;
}
export {};
