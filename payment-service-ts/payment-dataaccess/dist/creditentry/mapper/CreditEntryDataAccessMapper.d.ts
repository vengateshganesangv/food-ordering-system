import { CreditEntry } from '@food-ordering-system/payment-domain-core';
import { CreditEntryEntity } from '../entity/CreditEntryEntity';
export declare class CreditEntryDataAccessMapper {
    creditEntryToCreditEntryEntity(creditEntry: CreditEntry): CreditEntryEntity;
    creditEntryEntityToCreditEntry(creditEntryEntity: CreditEntryEntity): CreditEntry;
}
