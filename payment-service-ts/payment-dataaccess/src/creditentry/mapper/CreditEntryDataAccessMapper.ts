import { CustomerId, Money } from '@food-ordering-system/common-domain';
import { CreditEntry, CreditEntryId } from '@food-ordering-system/payment-domain-core';
import { CreditEntryEntity } from '../entity/CreditEntryEntity';

export class CreditEntryDataAccessMapper {
  public creditEntryToCreditEntryEntity(creditEntry: CreditEntry): CreditEntryEntity {
    const entity = new CreditEntryEntity();
    entity.id = creditEntry.getId()!.getValue();
    entity.customerId = creditEntry.getCustomerId().getValue();
    entity.totalCreditAmount = creditEntry.getTotalCreditAmount().getAmount();
    return entity;
  }

  public creditEntryEntityToCreditEntry(creditEntryEntity: CreditEntryEntity): CreditEntry {
    return CreditEntry.builder()
      .setCreditEntryId(new CreditEntryId(creditEntryEntity.id))
      .setCustomerId(new CustomerId(creditEntryEntity.customerId))
      .setTotalCreditAmount(new Money(creditEntryEntity.totalCreditAmount))
      .build();
  }
}
