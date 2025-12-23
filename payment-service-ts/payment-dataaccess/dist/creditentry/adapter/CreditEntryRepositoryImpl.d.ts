import { CustomerId } from '@food-ordering-system/common-domain';
import { CreditEntry } from '@food-ordering-system/payment-domain-core';
import { CreditEntryRepository } from '@food-ordering-system/payment-application-service';
import { CreditEntryJpaRepository } from '../repository/CreditEntryJpaRepository';
import { CreditEntryDataAccessMapper } from '../mapper/CreditEntryDataAccessMapper';
export declare class CreditEntryRepositoryImpl implements CreditEntryRepository {
    private readonly creditEntryJpaRepository;
    private readonly creditEntryDataAccessMapper;
    constructor(creditEntryJpaRepository: CreditEntryJpaRepository, creditEntryDataAccessMapper: CreditEntryDataAccessMapper);
    save(creditEntry: CreditEntry): Promise<CreditEntry>;
    findByCustomerId(customerId: CustomerId): Promise<CreditEntry | null>;
}
