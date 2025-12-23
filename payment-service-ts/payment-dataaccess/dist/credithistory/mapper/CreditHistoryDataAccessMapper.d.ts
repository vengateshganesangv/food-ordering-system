import { CreditHistory } from '@food-ordering-system/payment-domain-core';
import { CreditHistoryEntity } from '../entity/CreditHistoryEntity';
export declare class CreditHistoryDataAccessMapper {
    creditHistoryToCreditHistoryEntity(creditHistory: CreditHistory): CreditHistoryEntity;
    creditHistoryEntityToCreditHistory(creditHistoryEntity: CreditHistoryEntity): CreditHistory;
}
