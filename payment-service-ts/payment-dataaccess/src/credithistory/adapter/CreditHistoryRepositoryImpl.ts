import { CustomerId } from '@food-ordering-system/common-domain';
import { CreditHistory } from '@food-ordering-system/payment-domain-core';
import { CreditHistoryRepository } from '@food-ordering-system/payment-application-service';
import { CreditHistoryJpaRepository } from '../repository/CreditHistoryJpaRepository';
import { CreditHistoryDataAccessMapper } from '../mapper/CreditHistoryDataAccessMapper';

export class CreditHistoryRepositoryImpl implements CreditHistoryRepository {
  constructor(
    private readonly creditHistoryJpaRepository: CreditHistoryJpaRepository,
    private readonly creditHistoryDataAccessMapper: CreditHistoryDataAccessMapper
  ) {}

  public async save(creditHistory: CreditHistory): Promise<CreditHistory> {
    const entity = this.creditHistoryDataAccessMapper.creditHistoryToCreditHistoryEntity(creditHistory);
    const savedEntity = await this.creditHistoryJpaRepository.save(entity);
    return this.creditHistoryDataAccessMapper.creditHistoryEntityToCreditHistory(savedEntity);
  }

  public async findByCustomerId(customerId: CustomerId): Promise<CreditHistory[]> {
    const entities = await this.creditHistoryJpaRepository.findByCustomerId(customerId.getValue());
    return entities.map(entity => this.creditHistoryDataAccessMapper.creditHistoryEntityToCreditHistory(entity));
  }
}
