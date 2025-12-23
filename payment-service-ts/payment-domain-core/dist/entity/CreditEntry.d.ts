import { BaseEntity, CustomerId, Money } from '@food-ordering-system/common-domain';
import { CreditEntryId } from '../valueobject/CreditEntryId';
export interface CreditEntryProps {
    creditEntryId?: CreditEntryId;
    customerId: CustomerId;
    totalCreditAmount: Money;
}
export declare class CreditEntry extends BaseEntity<CreditEntryId> {
    private readonly customerId;
    private totalCreditAmount;
    private constructor();
    addCreditAmount(amount: Money): void;
    subtractCreditAmount(amount: Money): void;
    getCustomerId(): CustomerId;
    getTotalCreditAmount(): Money;
    static builder(): CreditEntryBuilder;
}
declare class CreditEntryBuilder {
    private creditEntryId?;
    private customerId?;
    private totalCreditAmount?;
    setCreditEntryId(creditEntryId: CreditEntryId): CreditEntryBuilder;
    setCustomerId(customerId: CustomerId): CreditEntryBuilder;
    setTotalCreditAmount(totalCreditAmount: Money): CreditEntryBuilder;
    build(): CreditEntry;
}
export {};
