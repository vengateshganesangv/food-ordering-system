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
    constructor(props: CreditEntryProps);
    addCreditAmount(amount: Money): void;
    subtractCreditAmount(amount: Money): void;
    static builder(): CreditEntryBuilder;
    getCustomerId(): CustomerId;
    getTotalCreditAmount(): Money;
}
export declare class CreditEntryBuilder {
    private creditEntryId?;
    private customerId?;
    private totalCreditAmount?;
    setCreditEntryId(creditEntryId: CreditEntryId): CreditEntryBuilder;
    setCustomerId(customerId: CustomerId): CreditEntryBuilder;
    setTotalCreditAmount(totalCreditAmount: Money): CreditEntryBuilder;
    build(): CreditEntry;
}
//# sourceMappingURL=CreditEntry.d.ts.map