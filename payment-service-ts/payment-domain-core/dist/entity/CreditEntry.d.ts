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
    static builder(): InstanceType<typeof CreditEntry.Builder>;
    static Builder: {
        new (): {
            creditEntryId?: CreditEntryId;
            customerId?: CustomerId;
            totalCreditAmount?: Money;
            setCreditEntryId(creditEntryId: CreditEntryId): /*elided*/ any;
            setCustomerId(customerId: CustomerId): /*elided*/ any;
            setTotalCreditAmount(totalCreditAmount: Money): /*elided*/ any;
            build(): CreditEntry;
        };
    };
}
