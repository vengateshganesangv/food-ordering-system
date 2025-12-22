import { CustomerId } from '@food-ordering-system/common-domain';
import { CreditEntry } from '@food-ordering-system/payment-domain-core';
import { CreditEntryRepository } from '@food-ordering-system/payment-application-service';
import { CreditEntryJpaRepository } from '../repository/CreditEntryJpaRepository';
import { CreditEntryDataAccessMapper } from '../mapper/CreditEntryDataAccessMapper';

export class CreditEntryRepositoryImpl implements CreditEntryRepository {
  constructor(
    private readonly creditEntryJpaRepository: CreditEntryJpaRepository,
    private readonly creditEntryDataAccessMapper: CreditEntryDataAccessMapper
  ) {}

  public async save(creditEntry: CreditEntry): Promise<CreditEntry> {
    const entity = this.creditEntryDataAccessMapper.creditEntryToCreditEntryEntity(creditEntry);
    const savedEntity = await this.creditEntryJpaRepository.save(entity);
    return this.creditEntryDataAccessMapper.creditEntryEntityToCreditEntry(savedEntity);
  }

  public async findByCustomerId(customerId: CustomerId): Promise<CreditEntry | null> {
    const entity = await this.creditEntryJpaRepository.findByCustomerId(customerId.getValue());
    return entity ? this.creditEntryDataAccessMapper.creditEntryEntityToCreditEntry(entity) : null;
  }
}
