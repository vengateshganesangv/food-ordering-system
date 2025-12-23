import { CustomerId } from '@food-ordering-system/common-domain';
import { CreditHistory } from '@food-ordering-system/payment-domain-core';
import { CreditHistoryRepository } from '@food-ordering-system/payment-application-service';
import { CreditHistoryJpaRepository } from '../repository/CreditHistoryJpaRepository';
import { CreditHistoryDataAccessMapper } from '../mapper/CreditHistoryDataAccessMapper';
export declare class CreditHistoryRepositoryImpl implements CreditHistoryRepository {
    private readonly creditHistoryJpaRepository;
    private readonly creditHistoryDataAccessMapper;
    constructor(creditHistoryJpaRepository: CreditHistoryJpaRepository, creditHistoryDataAccessMapper: CreditHistoryDataAccessMapper);
    save(creditHistory: CreditHistory): Promise<CreditHistory>;
    findByCustomerId(customerId: CustomerId): Promise<CreditHistory[]>;
}
