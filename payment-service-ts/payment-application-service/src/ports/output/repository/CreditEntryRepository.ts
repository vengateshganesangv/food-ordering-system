import { CustomerId } from '@food-ordering-system/common-domain';
import { CreditEntry } from '@food-ordering-system/payment-domain-core';

export interface CreditEntryRepository {
  save(creditEntry: CreditEntry): Promise<CreditEntry>;
  findByCustomerId(customerId: CustomerId): Promise<CreditEntry | null>;
}
