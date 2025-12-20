import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { CustomerId, Money } from '@food-ordering-system/common-domain';
import { CreditEntry, CreditEntryId } from '@food-ordering-system/payment-domain-core';
import { CreditEntryRepository } from '@food-ordering-system/payment-application-service';
import { CreditEntryEntity } from '../entity/CreditEntryEntity';

@injectable()
export class CreditEntryRepositoryImpl implements CreditEntryRepository {
  private repository: Repository<CreditEntryEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = dataSource.getRepository(CreditEntryEntity);
  }

  async save(creditEntry: CreditEntry): Promise<CreditEntry> {
    const entity = this.creditEntryToEntity(creditEntry);
    const saved = await this.repository.save(entity);
    return this.entityToCreditEntry(saved);
  }

  async findByCustomerId(customerId: CustomerId): Promise<CreditEntry | null> {
    const entity = await this.repository.findOne({ where: { customerId: customerId.getValue() } });
    return entity ? this.entityToCreditEntry(entity) : null;
  }

  private creditEntryToEntity(creditEntry: CreditEntry): CreditEntryEntity {
    const entity = new CreditEntryEntity();
    entity.id = creditEntry.getId()!.getValue();
    entity.customerId = creditEntry.customerId.getValue();
    entity.totalCreditAmount = creditEntry.totalCreditAmount.getAmount();
    return entity;
  }

  private entityToCreditEntry(entity: CreditEntryEntity): CreditEntry {
    return CreditEntry.builder()
      .setCreditEntryId(new CreditEntryId(entity.id))
      .setCustomerId(new CustomerId(entity.customerId))
      .setTotalCreditAmount(new Money(entity.totalCreditAmount))
      .build();
  }
}
