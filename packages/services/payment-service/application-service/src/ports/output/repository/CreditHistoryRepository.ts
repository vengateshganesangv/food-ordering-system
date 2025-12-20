import { CreditHistory } from '@food-ordering-system/payment-domain-core';
import { CustomerId } from '@food-ordering-system/common-domain';

export interface CreditHistoryRepository {
  save(creditHistory: CreditHistory): Promise<CreditHistory>;
  findByCustomerId(customerId: CustomerId): Promise<CreditHistory[]>;
}
