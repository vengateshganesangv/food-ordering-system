import { OrderApproval } from '@food-ordering-system/restaurant-domain-core';

export interface OrderApprovalRepository {
  save(orderApproval: OrderApproval): Promise<OrderApproval>;
}
