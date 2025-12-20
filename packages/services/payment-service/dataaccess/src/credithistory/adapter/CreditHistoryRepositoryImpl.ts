import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { CustomerId, Money } from '@food-ordering-system/common-domain';
import { CreditHistory, CreditHistoryId, TransactionType } from '@food-ordering-system/payment-domain-core';
import { CreditHistoryRepository } from '@food-ordering-system/payment-application-service';
import { CreditHistoryEntity } from '../entity/CreditHistoryEntity';

@injectable()
export class CreditHistoryRepositoryImpl implements CreditHistoryRepository {
  private repository: Repository<CreditHistoryEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = dataSource.getRepository(CreditHistoryEntity);
  }

  async save(creditHistory: CreditHistory): Promise<CreditHistory> {
    const entity = this.creditHistoryToEntity(creditHistory);
    const saved = await this.repository.save(entity);
    return this.entityToCreditHistory(saved);
  }

  async findByCustomerId(customerId: CustomerId): Promise<CreditHistory[]> {
    const entities = await this.repository.find({ where: { customerId: customerId.getValue() } });
    return entities.map((entity) => this.entityToCreditHistory(entity));
  }

  private creditHistoryToEntity(creditHistory: CreditHistory): CreditHistoryEntity {
    const entity = new CreditHistoryEntity();
    entity.id = creditHistory.getId()!.getValue();
    entity.customerId = creditHistory.customerId.getValue();
    entity.amount = creditHistory.amount.getAmount();
    entity.type = creditHistory.transactionType;
    return entity;
  }

  private entityToCreditHistory(entity: CreditHistoryEntity): CreditHistory {
    return CreditHistory.builder()
      .setCreditHistoryId(new CreditHistoryId(entity.id))
      .setCustomerId(new CustomerId(entity.customerId))
      .setAmount(new Money(entity.amount))
      .setTransactionType(entity.type)
      .build();
  }
}
