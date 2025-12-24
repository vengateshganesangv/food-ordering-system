import { OrderApproval } from '../../../../restaurant-domain-core/src/entity/OrderApproval';

/**
 * Order Approval Repository (Output Port)
 * Interface for persisting order approval entities
 */
export interface OrderApprovalRepository {
  /**
   * Save order approval entity
   * @param orderApproval The order approval to save
   * @returns The saved order approval
   */
  save(orderApproval: OrderApproval): Promise<OrderApproval>;
}
