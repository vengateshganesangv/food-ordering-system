import { CustomerId, Money } from '@food-ordering-system/common-domain';
import { CreditHistory, CreditHistoryId } from '@food-ordering-system/payment-domain-core';
import { CreditHistoryEntity } from '../entity/CreditHistoryEntity';

export class CreditHistoryDataAccessMapper {
  public creditHistoryToCreditHistoryEntity(creditHistory: CreditHistory): CreditHistoryEntity {
    const entity = new CreditHistoryEntity();
    entity.id = creditHistory.getId()!.getValue();
    entity.customerId = creditHistory.getCustomerId().getValue();
    entity.amount = creditHistory.getAmount().getAmount();
    entity.type = creditHistory.getTransactionType();
    return entity;
  }

  public creditHistoryEntityToCreditHistory(creditHistoryEntity: CreditHistoryEntity): CreditHistory {
    return CreditHistory.builder()
      .setCreditHistoryId(new CreditHistoryId(creditHistoryEntity.id))
      .setCustomerId(new CustomerId(creditHistoryEntity.customerId))
      .setAmount(new Money(creditHistoryEntity.amount))
      .setTransactionType(creditHistoryEntity.type)
      .build();
  }
}
